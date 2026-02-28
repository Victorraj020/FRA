@echo off
echo ===================================================
echo     Starting Python DSS API Server (Port 5000)
echo ===================================================
echo.
echo Installing requirements (flask, flask-cors)...
pip install flask flask-cors
echo.
echo Starting the server...
python dss_api.py
pause
