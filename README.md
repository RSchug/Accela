# ACCELA - Accela Civic Platform Master Scripts

9.2.1 branch created for next release. 

9.2.0 Branch created for next release. - This branch has been merged to the master on 10/17/2017 with 9 changes. 
* Changes made to functions in INCLUDES_ACCELA_FUNCTIONS and INCLUDES_ACCELA_FUNCTIONS_ASB folders will be compiled and added to the appropriate files after all changes are made and merge with Master is ready. 

7.3.0 Branch for new release procedure

>Root
README.md – This file

master – Active branch. Do not commit anything to branch that has not been unit tested

* Documentation – Documentation folder containing information on usage of master scripts

* INCLUDES_ACCELA_FUNCTIONS – Folder containing the accela includes functions each function should be its own .js file

* INCLUDES_ACCELA_FUNCTIONS_ASB – Folder containing the accela includes for applicaiton submit before each function should be its on .js file

* Master Scripts – Folder containing the master scripts heads that get associated to an event and the includes files.  These will be merged into product releases

* Misc – Folder containing Data Manager export and various utilities not directly tied into Master Script framework

* Sample Repository Structure – Folder and files for seeding a Agency Repository

* Templates – Script files that are used as primers for common actions, but are not part of the master script framework

* tags – Contains release information. No new features should be added to tags. After applying bug fix to a release ensure this is merged into Trunk

* branches – When work is to be done, create a branch for feature being created. After unit testing the branch merge back into trunk and remove.
