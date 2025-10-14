@echo off
set "ROOT=%~dp0"
pushd "%ROOT%"

echo === FRA - Start All Services (Nginx, Backend, Frontend) ===

call :START_BACKEND
call :START_FRONTEND
call :START_NGINX

echo.
echo All start commands issued. New terminals may open for backend/frontend.
echo - Backend:  http://localhost:8000/health (direct)
echo - Nginx:    http://localhost/health (proxied)
echo - Frontend: http://localhost:3000

popd
exit /b 0

:START_BACKEND
echo [Backend] Checking backend folder...
if not exist "backend\ocr_service" (
  echo [Backend] Directory not found: "%ROOT%backend\ocr_service"
  goto :eof
)
pushd "backend\ocr_service"
if not exist ".venv\Scripts\python.exe" (
  echo [Backend] Creating venv...
  python -m venv .venv
)
if not exist ".venv\Scripts\python.exe" (
  echo [Backend] Error: Python venv not created. Ensure Python is installed and on PATH.
  popd
  goto :eof
)
echo [Backend] Installing requirements...
".venv\Scripts\pip.exe" install -r requirements.txt >nul 2>&1
echo [Backend] Launching server on port 8000...
start "FRA_Backend_8000" cmd /c "set PORT=8000 ^&^& .venv\Scripts\python.exe -m uvicorn app:app --host 0.0.0.0 --port 8000"
popd
goto :eof

:START_FRONTEND
echo [Frontend] Checking frontend folder...
if not exist "frontend" (
  echo [Frontend] Directory not found: "%ROOT%frontend"
  goto :eof
)
pushd "frontend"
if not exist "node_modules" (
  echo [Frontend] Installing node modules first run...
  call npm install
)
echo [Frontend] Launching dev server on port 3000...
start "FRA_Frontend_3000" cmd /c "npm run dev"
popd
goto :eof

:START_NGINX
echo [Nginx] Preparing Nginx...
set "NGINX_DIR=%ROOT%nginx"
set "NGINX_EXE=%NGINX_DIR%\nginx-1.24.0\nginx.exe"
set "NGINX_CONF=nginx_windows.conf"
if not exist "%NGINX_EXE%" (
  echo [Nginx] nginx.exe not found at: %NGINX_EXE%
  echo         Ensure Nginx is extracted in FRA\nginx\nginx-1.24.0
  goto :eof
)
pushd "%NGINX_DIR%"
if not exist "logs" mkdir "logs" >nul 2>&1
if not exist "temp" mkdir "temp" >nul 2>&1
if not exist "temp\client_body_temp" mkdir "temp\client_body_temp" >nul 2>&1
if not exist "temp\proxy_temp" mkdir "temp\proxy_temp" >nul 2>&1
if not exist "temp\fastcgi_temp" mkdir "temp\fastcgi_temp" >nul 2>&1
if not exist "temp\uwsgi_temp" mkdir "temp\uwsgi_temp" >nul 2>&1
if not exist "temp\scgi_temp" mkdir "temp\scgi_temp" >nul 2>&1

"%NGINX_EXE%" -t -p . -c %NGINX_CONF%
if exist "logs\nginx.pid" del /f /q "logs\nginx.pid" >nul 2>&1
echo [Nginx] Launching reverse proxy on port 80...
start "FRA_Nginx_80" "%NGINX_EXE%" -p . -c %NGINX_CONF%
popd
goto :eof
