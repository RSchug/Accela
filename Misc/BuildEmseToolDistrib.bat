del  /q ..\EMSEToolDistrib\MasterScripts\*.js 
del  /q ..\EMSEToolDistrib\INCLUDES_ACCELA_FUNCTIONS\*.js
del  /q ..\EMSEToolDistrib\INCLUDES_ACCELA_FUNCTIONS_ASB\*.js
xcopy /I /Y  "..\Master Scripts\*.js"  ..\EMSEToolDistrib\MasterScripts 
xcopy /I /Y "..\INCLUDES_ACCELA_FUNCTIONS\*.js"  ..\EMSEToolDistrib\INCLUDES_ACCELA_FUNCTIONS
xcopy /I /Y "..\INCLUDES_ACCELA_FUNCTIONS_ASB\*.js"  ..\EMSEToolDistrib\INCLUDES_ACCELA_FUNCTIONS_ASB
xcopy /I /Y "..\INCLUDES_ACCELA_GLOBALS.js"  ..\EMSEToolDistrib\MasterScripts
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_GLOBALS\"));" "eval(getScriptText(\"INCLUDES_ACCELA_GLOBALS\",null,useCustomScriptFile));"
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS\"));" "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS\",null,useCustomScriptFile));"
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS_ASB\"));" "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS_ASB\",null,useCustomScriptFile));"
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_GLOBALS\", SA));" "eval(getScriptText(\"INCLUDES_ACCELA_GLOBALS\", SA,useCustomScriptFile));"
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS\", SA));" "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS\", SA,useCustomScriptFile));"
fart  -v -i ..\EMSEToolDistrib\MasterScripts\*.js "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS_ASB\", SA));" "eval(getScriptText(\"INCLUDES_ACCELA_FUNCTIONS_ASB\", SA,useCustomScriptFile));"