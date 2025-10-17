@echo off
title Sistema ONG - Iniciando...
echo.
echo ========================================
echo    SISTEMA ONG - INICIANDO SERVIDORES
echo ========================================
echo.

REM Verificar se o Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Node.js nao encontrado!
    echo Por favor, instale o Node.js primeiro.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar se o PostgreSQL está rodando
echo Verificando conexao com o banco de dados...
timeout /t 2 /nobreak >nul

REM Navegar para o diretorio do projeto
cd /d "%~dp0"

REM Verificar se as dependencias estao instaladas
if not exist "backend\node_modules" (
    echo Instalando dependencias do backend...
    cd backend
    call npm install
    cd ..
)

if not exist "frontend\node_modules" (
    echo Instalando dependencias do frontend...
    cd frontend
    call npm install
    cd ..
)

echo.
echo Iniciando servidor backend (porta 3001)...
start "Backend - Sistema ONG" cmd /k "cd /d %~dp0backend && npm run dev"

REM Aguardar o backend inicializar
echo Aguardando backend inicializar...
timeout /t 5 /nobreak >nul

echo Iniciando servidor frontend (porta 3000)...
start "Frontend - Sistema ONG" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo ========================================
echo    SISTEMA INICIADO COM SUCESSO!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Pressione qualquer tecla para fechar esta janela...
pause >nul
