@echo off
setlocal

set "JAVA_EXE=java.exe"
if exist "C:\Program Files\Java 21\jdk-21\bin\java.exe" (
    set "JAVA_EXE=C:\Program Files\Java 21\jdk-21\bin\java.exe"
)

set "DIR=%~dp0"
set "WRAPPER_JAR=%DIR%.mvn\wrapper\maven-wrapper.jar"

if not exist "%WRAPPER_JAR%" (
    echo Downloading Maven Wrapper Jar...
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar', '%WRAPPER_JAR%')"
)

"%JAVA_EXE%" -classpath "%WRAPPER_JAR%" "-Dmaven.multiModuleProjectDirectory=%DIR%." org.apache.maven.wrapper.MavenWrapperMain %*
