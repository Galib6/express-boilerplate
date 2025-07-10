import dotenv from 'dotenv';
import fs from 'fs';

import { envSchema, EnvVars } from './env-schema';

// Determine which .env file to load based on NODE_ENV
// eslint-disable-next-line node/no-process-env
const envFile = `.env.${process.env.NODE_ENV || 'dev'}`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  // eslint-disable-next-line node/no-process-env
  console.log(`✅ Loaded environment: ${envFile}\nNODE_ENV: ${process.env.NODE_ENV}`);
} else {
  console.warn(`⚠️ Warning: Environment file "${envFile}" not found. Using defaults.`);
}

// eslint-disable-next-line node/no-process-env
const parsedEnv = envSchema.safeParse(process.env);
// eslint-disable-next-line node/no-process-env
const NODE_ENV = process.env.NODE_ENV || 'development';

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.format();
  const missingKeys = Object.keys(formattedErrors).filter(key => key !== '_errors');

  console.error(
    `❌ Missing environment variables in "${NODE_ENV}" .env file:\n${missingKeys.join(', ')}`,
  );
  process.exit(1); // Stop execution if required env variables are missing
}

console.log(`Loaded environment: .env.${NODE_ENV}`);

export const env: EnvVars = parsedEnv.data;

// ✅ Get only user-defined env variables from `.env`
// eslint-disable-next-line node/no-process-env
const definedEnvKeys = Object.keys(process.env);

// ✅ Allowed environment variables (from schema)
const allowedKeys = Object.keys(envSchema.shape);

// ✅ System variables to ignore (Windows/Linux/Mac default variables)
const systemVars = new Set([
  // Windows variables
  'ACLOCAL_PATH',
  'ALLUSERSPROFILE',
  'APPDATA',
  'COLOR',
  'COMMONPROGRAMFILES',
  'CommonProgramFiles(x86)',
  'CommonProgramW6432',
  'COMPUTERNAME',
  'COMSPEC',
  'IGCCSVC_DB',
  'CONFIG_SITE',
  'DriverData',
  'EXEPATH',
  'HOMEDRIVE',
  'HOMEPATH',
  'LOCALAPPDATA',
  'LOGONSERVER',
  'MINGW_CHOST',
  'MINGW_PACKAGE_PREFIX',
  'MINGW_PREFIX',
  'MSYS',
  'MSYSTEM',
  'MSYSTEM_CARCH',
  'MSYSTEM_CHOST',
  'MSYSTEM_PREFIX',
  'NUMBER_OF_PROCESSORS',
  'NVM_HOME',
  'NVM_SYMLINK',
  'OneDrive',
  'OneDriveConsumer',
  'ORIGINAL_PATH',
  'ORIGINAL_TEMP',
  'ORIGINAL_TMP',
  'OS',
  'PATHEXT',
  'PLINK_PROTOCOL',
  'PROCESSOR_ARCHITECTURE',
  'PROCESSOR_IDENTIFIER',
  'PROCESSOR_LEVEL',
  'PROCESSOR_REVISION',
  'ProgramData',
  'PROGRAMFILES',
  'ProgramFiles(x86)',
  'ProgramW6432',
  'PROMPT',
  'PSModulePath',
  'PUBLIC',
  'SESSIONNAME',
  'SYSTEMDRIVE',
  'SYSTEMROOT',
  'USERDOMAIN',
  'USERDOMAIN_ROAMINGPROFILE',
  'USERNAME',
  'USERPROFILE',
  'WINDIR',
  'WSLENV',
  'WT_PROFILE_ID',
  'WT_SESSION',
  'ZES_ENABLE_SYSMAN',
  // Linux/Unix variables
  'BAMF_DESKTOP_FILE_HINT',
  'CHROME_DESKTOP',
  'COLORTERM',
  'DBUS_SESSION_BUS_ADDRESS',
  'DBUS_STARTER_ADDRESS',
  'DBUS_STARTER_BUS_TYPE',
  'DEBUGINFOD_URLS',
  'DESKTOP_SESSION',
  'DISPLAY',
  'EDITOR',
  'FONTCONFIG_FILE',
  'FONTCONFIG_PATH',
  'GDK_BACKEND',
  'GDK_BACKEND_VSCODE_SNAP_ORIG',
  'GDMSESSION',
  'GIO_LAUNCHED_DESKTOP_FILE',
  'GIO_LAUNCHED_DESKTOP_FILE_PID',
  'GIO_MODULE_DIR',
  'GIO_MODULE_DIR_VSCODE_SNAP_ORIG',
  'GIT_ASKPASS',
  'GIT_PAGER',
  'GJS_DEBUG_OUTPUT',
  'GJS_DEBUG_TOPICS',
  'GNOME_DESKTOP_SESSION_ID',
  'GNOME_SETUP_DISPLAY',
  'GNOME_SHELL_SESSION_MODE',
  'GNOME_TERMINAL_SCREEN',
  'GNOME_TERMINAL_SERVICE',
  'GSM_SKIP_SSH_AGENT_WORKAROUND',
  'GSETTINGS_SCHEMA_DIR',
  'GSETTINGS_SCHEMA_DIR_VSCODE_SNAP_ORIG',
  'GTK_EXE_PREFIX',
  'GTK_EXE_PREFIX_VSCODE_SNAP_ORIG',
  'GTK_IM_MODULE_FILE',
  'GTK_IM_MODULE_FILE_VSCODE_SNAP_ORIG',
  'GTK_MODULES',
  'GTK_PATH',
  'GTK_PATH_VSCODE_SNAP_ORIG',
  'HOME',
  'HOSTNAME',
  'IM_CONFIG_CHECK_ENV',
  'IM_CONFIG_PHASE',
  'INFOPATH',
  'INIT_CWD',
  'INVOCATION_ID',
  'JOURNAL_STREAM',
  'LANG',
  'LESSCLOSE',
  'LESSOPEN',
  'LOCPATH',
  'LOCPATH_VSCODE_SNAP_ORIG',
  'LOGNAME',
  'LS_COLORS',
  'MANAGERPID',
  'MANPATH',
  'MEMORY_PRESSURE_WATCH',
  'MEMORY_PRESSURE_WRITE',
  'NODE',
  'NO_AT_BRIDGE',
  'NVM_BIN',
  'NVM_CD_FLAGS',
  'NVM_DIR',
  'NVM_INC',
  'OLDPWD',
  'ORIGINAL_XDG_CURRENT_DESKTOP',
  'PATH',
  'PKG_CONFIG_PATH',
  'PKG_CONFIG_SYSTEM_INCLUDE_PATH',
  'PKG_CONFIG_SYSTEM_LIBRARY_PATH',
  'PWD',
  'QT_ACCESSIBILITY',
  'QT_IM_MODULE',
  'SESSION_MANAGER',
  'SHELL',
  'SHLVL',
  'SSH_ASKPASS',
  'SSH_AUTH_SOCK',
  'SYSTEMD_EXEC_PID',
  'TEMP',
  'TERM',
  'TERM_PROGRAM',
  'TERM_PROGRAM_VERSION',
  'TMP',
  'TMPDIR',
  'UNUSED_VARIABLE',
  'USER',
  'VTE_VERSION',
  'VSCODE_GIT_ASKPASS_EXTRA_ARGS',
  'VSCODE_GIT_ASKPASS_MAIN',
  'VSCODE_GIT_ASKPASS_NODE',
  'VSCODE_GIT_IPC_HANDLE',
  'WAYLAND_DISPLAY',
  'XAUTHORITY',
  'XDG_CONFIG_DIRS',
  'XDG_CONFIG_DIRS_VSCODE_SNAP_ORIG',
  'XDG_CURRENT_DESKTOP',
  'XDG_DATA_DIRS',
  'XDG_DATA_DIRS_VSCODE_SNAP_ORIG',
  'XDG_DATA_HOME',
  'XDG_DATA_HOME_VSCODE_SNAP_ORIG',
  'XDG_MENU_PREFIX',
  'XDG_RUNTIME_DIR',
  'XDG_SESSION_CLASS',
  'XDG_SESSION_DESKTOP',
  'XDG_SESSION_TYPE',
  'XMODIFIERS',
  'YARN_WRAP_OUTPUT',
  '_',
]);

// ✅ Filter out system variables, only check extra `.env` variables
const extraKeys = definedEnvKeys.filter(
  key =>
    !allowedKeys.includes(key) &&
    !systemVars.has(key) &&
    !key.startsWith('npm_') &&
    !key.startsWith('MSYSTEM') &&
    !key.startsWith('MINGW') &&
    !key.startsWith('WT_'),
);

if (extraKeys.length > 0) {
  console.warn(`⚠️ Warning: Unused environment variables detected: ${extraKeys.join(', ')}`);
}
