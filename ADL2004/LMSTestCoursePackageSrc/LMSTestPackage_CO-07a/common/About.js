/*************************************************************************
**
** Filename:  About.js
**
** File Description:
**    Abstract versioning info for all Test Suite about pages.
**
** Author: ADLI Project
**
** Module/Package Name:  none
** Module/Package Description: none
**
** Design Issues:
**
** Implementation Issues:
** Known Problems:
** Side Effects:
**
** References: ADL SCORM
**
***************************************************************************
        
   ADL SCORM 2004 4th Edition Test Suite Software
   
   The ADL SCORM 2004 4th Ed. Test Suite Software is licensed under
   Creative Commons Attribution-Noncommercial-No Derivative Works 3.0 United States.

   The Advanced Distributed Learning Initiative allows you to:
     *  Share - to copy, distribute, display, and perform the work.
   
   Under the following conditions:
     *  Attribution. You must attribute the work in the manner specified by the author
        or licensor (but not in any way that suggests that they endorse you or your use
        of the work).
     *  Noncommercial. You may not use this work for commercial purposes.
     *  No Derivative Works. You may not alter, transform, or build upon this work.
     
   For any reuse or distribution, you must make clear to others the license terms of this
   work. The best way to do this is with a link to this web page.
   
   Any of the above conditions can be waived if you get permission from the copyright
   holder. Nothing in this license impairs or restricts the author's moral rights.
 
**************************************************************************/

//global variables
var version = "Version 1.1.1";
var scormVersion = "2004 4<sup>th</sup> Edition";
var certificationCode =
         "<center>" +
         "   <table border='1' cellspacing='3' width='550px'>" +
         "      <tr >" +
         "         <td id='tableColor'>" +
         "             <p>Certification Note: Successful outcome of this" +
         "               test does not constitute ADL Certification " +
         "               unless an ADL Certification Auditor" +
         "               conducted the test.</p>" +
         "         </td>" +
         "      </tr>" +
         "   </table>" +
         "</center>";



/*******************************************************************************
**
** Function: displayVersion()
** Inputs:  None
** Return:  None
**
** Description:
**    Write the version number to the html page.
**
*******************************************************************************/
function displayVersion()
{
   document.write( version );
}

/*******************************************************************************
**
** Function: displayScormVersion()
** Inputs:  None
** Return:  None
**
** Description:
**    Write the SCORM version number to the html page.
**
*******************************************************************************/
function displayScormVersion()
{
   document.write( scormVersion );
}

/*******************************************************************************
**
** Function: displayTestSuiteVersion()
** Inputs:  None
** Return:  None
**
** Description:
**    Write the test type (Auditor/Self Test) to the html page.
**
*******************************************************************************/
function displayTestSuiteVersion()
{
   document.write( version );
}


/*******************************************************************************
**
**Function: displayCertification()
**Inputs:  None
**Return:  NONE
**
**Description:
**   Write the certification note.
**
*******************************************************************************/
function displayCertification()
{
    document.write( certificationCode )
}

