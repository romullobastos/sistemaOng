@echo off
title Sistema ONG - Abrindo...
echo Abrindo Sistema ONG no navegador...
echo.
echo Aguarde alguns segundos para os servidores carregarem...
timeout /t 3 /nobreak >nul

REM Abrir o sistema no navegador
start http://localhost:3000

echo Sistema aberto no navegador!
echo.
echo Se o sistema nao abrir, verifique se os servidores estao rodando:
echo - Backend: http://localhost:3001/health
echo - Frontend: http://localhost:3000
echo.
pause
