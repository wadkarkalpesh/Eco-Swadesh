/**
 * Deccan Origin Unified Application Orchestrator
 * Spawns both Backend API Server (Node/Express - Port 5000) and
 * Frontend Expo v54 Web Server (Metro - Port 8081) concurrently.
 * Features automatic pre-launch port cleanup to prevent non-interactive prompt failures.
 */

const { spawn, execSync } = require('child_process');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const backendDir = path.join(rootDir, 'Backend');
const frontendDir = path.join(rootDir, 'Frontend');

console.log('\n======================================================');
console.log('🌱 Launching Deccan Origin Monorepo Services...');
console.log('📦 Backend Directory :', backendDir);
console.log('📱 Frontend Directory:', frontendDir);
console.log('======================================================\n');

/**
 * Automatically terminates lingering processes bound to target ports
 */
function killPort(port) {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${port}`, { stdio: ['pipe', 'pipe', 'ignore'] }).toString();
      const lines = output.split('\n');
      const pids = new Set();
      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/);
        if (parts.length >= 5 && parts[1].includes(`:${port}`)) {
          const pid = parts[parts.length - 1];
          if (pid && pid !== '0' && pid !== process.pid.toString()) {
            pids.add(pid);
          }
        }
      });
      pids.forEach((pid) => {
        try {
          execSync(`taskkill /pid ${pid} /f /t`, { stdio: 'ignore' });
          console.log(`🧹 Freed occupied port ${port} (Killed PID ${pid})`);
        } catch (_e) {}
      });
    } else {
      execSync(`lsof -t -i:${port} | xargs kill -9 2>/dev/null || true`, { stdio: 'ignore' });
    }
  } catch (_e) {
    // Port is already free
  }
}

// 1. Clean up lingering processes on backend (5000) and frontend (8081) ports
killPort(5000);
killPort(8081);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';
const isNative = process.argv.includes('--native');

// 2. Spawn Backend Process
const backendProcess = spawn(npmCmd, ['start'], {
  cwd: backendDir,
  shell: true,
  env: { ...process.env, PORT: process.env.PORT || '5000' },
});

// 3. Spawn Frontend Process (Expo Web / App)
const frontendArgs = isNative ? ['start'] : ['run', 'web'];
const frontendProcess = spawn(npmCmd, frontendArgs, {
  cwd: frontendDir,
  shell: true,
  env: {
    ...process.env,
    EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/v1',
    CI: '1', // Prevents non-interactive prompt freezes
  },
});

// Log Stream Formatter
function pipeLogs(processRef, prefix, colorCode) {
  const color = `\x1b[${colorCode}m`;
  const reset = '\x1b[0m';

  if (processRef.stdout) {
    processRef.stdout.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach((line) => {
        if (line.trim()) {
          console.log(`${color}[${prefix}]${reset} ${line}`);
        }
      });
    });
  }

  if (processRef.stderr) {
    processRef.stderr.on('data', (data) => {
      const lines = data.toString().split('\n');
      lines.forEach((line) => {
        if (line.trim()) {
          console.error(`${color}[${prefix} ERR]${reset} ${line}`);
        }
      });
    });
  }
}

pipeLogs(backendProcess, 'BACKEND', '32');  // Green for Backend
pipeLogs(frontendProcess, 'FRONTEND', '36'); // Cyan for Frontend

// Graceful Termination Handler
function shutdown() {
  console.log('\n🛑 Shutting down Deccan Origin services...');
  if (backendProcess && !backendProcess.killed) {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t']);
      } else {
        backendProcess.kill('SIGINT');
      }
    } catch (_e) {}
  }
  if (frontendProcess && !frontendProcess.killed) {
    try {
      if (isWindows) {
        spawn('taskkill', ['/pid', frontendProcess.pid, '/f', '/t']);
      } else {
        frontendProcess.kill('SIGINT');
      }
    } catch (_e) {}
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
