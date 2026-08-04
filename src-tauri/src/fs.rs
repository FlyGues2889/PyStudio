// 本地真实文件系统命令：让 Python You 可以直接读写磁盘上的工作区
use std::fs;
use std::path::{Path, PathBuf};

use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct FsEntry {
    name: String,
    path: String,
    is_folder: bool,
    children: Option<Vec<FsEntry>>,
    content: Option<String>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImportItem {
    path: String,
    content: String,
    is_folder: bool,
}

// 打开文件夹时跳过与学习无关的目录，避免拖慢树构建
const SKIP_DIRS: &[&str] = &[
    ".git", "node_modules", "__pycache__", ".venv", "venv", "env", ".env",
    ".idea", ".vscode", ".pnpm-store", "dist", "target", "build",
];

fn read_dir_recursive(dir: &Path) -> std::io::Result<Vec<FsEntry>> {
    let mut entries = Vec::new();
    let rd = fs::read_dir(dir)?;
    for entry in rd.flatten() {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        if SKIP_DIRS.contains(&name.as_str()) {
            continue;
        }
        if path.is_dir() {
            let children = read_dir_recursive(&path)?;
            entries.push(FsEntry {
                name,
                path: path.to_string_lossy().to_string(),
                is_folder: true,
                children: Some(children),
                content: None,
            });
        } else if path.is_file() {
            // 内容改为按需加载（打开文件时再读取），避免启动时全量读取拖慢初始化
            entries.push(FsEntry {
                name,
                path: path.to_string_lossy().to_string(),
                is_folder: false,
                children: None,
                content: None,
            });
        }
    }
    // 文件夹优先，其次文件，均按名称排序
    entries.sort_by(|a, b| {
        if a.is_folder != b.is_folder {
            return if a.is_folder { std::cmp::Ordering::Less } else { std::cmp::Ordering::Greater };
        }
        a.name.to_lowercase().cmp(&b.name.to_lowercase())
    });
    Ok(entries)
}

#[tauri::command]
pub fn fs_read_directory(path: String) -> Result<Vec<FsEntry>, String> {
    read_dir_recursive(&PathBuf::from(&path)).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_write_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn fs_create_file(parent_path: String, name: String) -> Result<String, String> {
    let dir = if parent_path.is_empty() {
        PathBuf::from(".")
    } else {
        PathBuf::from(&parent_path)
    };
    let path = dir.join(&name);
    fs::write(&path, format!("# {name}\n")).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn fs_create_dir(parent_path: String, name: String) -> Result<String, String> {
    let dir = if parent_path.is_empty() {
        PathBuf::from(".")
    } else {
        PathBuf::from(&parent_path)
    };
    let path = dir.join(&name);
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    Ok(path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn fs_rename(path: String, new_name: String) -> Result<String, String> {
    let old = PathBuf::from(&path);
    let new_path = old
        .parent()
        .map(|p| p.join(&new_name))
        .unwrap_or_else(|| PathBuf::from(&new_name));
    fs::rename(&old, &new_path).map_err(|e| e.to_string())?;
    Ok(new_path.to_string_lossy().to_string())
}

#[tauri::command]
pub fn fs_delete(path: String) -> Result<(), String> {
    let p = PathBuf::from(&path);
    if p.is_dir() {
        fs::remove_dir_all(&p).map_err(|e| e.to_string())
    } else {
        fs::remove_file(&p).map_err(|e| e.to_string())
    }
}

// 首次启动时由本命令创建空的 WorkSpace/ 工作区文件夹（不写入任何示例文件）。
// 便携布局：优先放在 exe 同级目录；若不可写则回退到应用数据目录。
#[tauri::command]
pub fn ensure_default_workspace(app: AppHandle) -> Result<String, String> {
    let app_data_root = || {
        app.path()
            .app_data_dir()
            .map_err(|e| e.to_string())
            .map(|d| d.join("WorkSpace"))
    };

    let root: PathBuf = match std::env::current_exe() {
        Ok(exe) => match exe.parent() {
            Some(dir) => {
                let candidate = dir.join("WorkSpace");
                if candidate.exists() {
                    candidate
                } else {
                    match fs::create_dir_all(&candidate) {
                        Ok(_) => candidate,
                        Err(_) => app_data_root()?,
                    }
                }
            }
            None => app_data_root()?,
        },
        Err(_) => app_data_root()?,
    };
    // 仅在不存在时才创建空文件夹，避免每次启动都重复建目录
    if !root.exists() {
        fs::create_dir_all(&root).map_err(|e| e.to_string())?;
    }
    Ok(root.to_string_lossy().to_string())
}

// 把虚拟工作区（内存中的文件树）落盘到临时目录，供本机 Python 以该目录为 cwd 运行
#[tauri::command]
pub fn fs_materialize_workspace(items: Vec<ImportItem>) -> Result<String, String> {
    let nanos = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .map(|d| d.as_nanos())
        .unwrap_or(0);
    let base = std::env::temp_dir().join(format!("python_you_ws_{}_{}", std::process::id(), nanos));
    for item in &items {
        let rel = item.path.trim_start_matches('/');
        let target = base.join(rel);
        if item.is_folder {
            fs::create_dir_all(&target).map_err(|e| e.to_string())?;
        } else {
            if let Some(parent) = target.parent() {
                fs::create_dir_all(parent).map_err(|e| e.to_string())?;
            }
            fs::write(&target, &item.content).map_err(|e| e.to_string())?;
        }
    }
    Ok(base.to_string_lossy().to_string())
}
