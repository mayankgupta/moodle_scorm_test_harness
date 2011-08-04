/*******************************************************************************
**
** Filename:  lmsrtefunctions.js
**
** File Description:  This file contains several javascript variable definitions
**                   and functions that are used commonly by all of the SCO HTML
**                   files in the LMS Runtime Environment Conformance Test.  It
**                   is intended to be included in each SCO HTML file.
**
** Author: ADL Technical Team
**
** Contract Number:
** Company Name: Concurrent Technologies Corporation
**
**
** Design Issues:   None
** Implementation Issues:  None

** Known Problems: None
** Side Effects:  None
**
** References:
**
**
***************************************************************************
**
** Advanced Distributed Learning Co-Laboratory (ADL Co-Lab) grants you
** ("Licensee") a non-exclusive, royalty free, license to use, modify and
** redistribute this software in source and binary code form, provided that
** i) this copyright notice and license appear on all copies of the software;
** and ii) Licensee does not utilize the software in a manner which is
** disparaging to ADL Co-Lab.
**
** This software is provided "AS IS," without a warranty of any kind.  ALL
** EXPRESS OR IMPLIED CONDITIONS, REPRESENTATIONS AND WARRANTIES, INCLUDING
** ANY IMPLIED WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE
** OR NON-INFRINGEMENT, ARE HEREBY EXCLUDED.  ADL Co-Lab AND ITS LICENSORS
** SHALL NOT BE LIABLE FOR ANY DAMAGES SUFFERED BY LICENSEE AS A RESULT OF
** USING, MODIFYING OR DISTRIBUTING THE SOFTWARE OR ITS DERIVATIVES.  IN NO
** EVENT WILL ADL Co-Lab OR ITS LICENSORS BE LIABLE FOR ANY LOST REVENUE,
** PROFIT OR DATA, OR FOR DIRECT, INDIRECT, SPECIAL, CONSEQUENTIAL,
** INCIDENTAL OR PUNITIVE DAMAGES, HOWEVER CAUSED AND REGARDLESS OF THE
** THEORY OF LIABILITY, ARISING OUT OF THE USE OF OR INABILITY TO USE
** SOFTWARE, EVEN IF ADL Co-Lab HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
** DAMAGES.
**
** Date Changed   Author            Reason for Changes
** ------------   ----------------  -------------------------------------------
**
** 07/11/2001     Jeff Falls        PT 966: Course 1/SCOs 5 and 6 reported "red"
**                                  failure messages for optional data model
**                                  elements returning a "404" Not Implemented
**                                  string.  These are now reported as "yellow"
**                                  warning message if the data model element is
**                                  optional.  Otherwise, it is a mandatory
**                                  element and the "red" failure message is
**                                  reported.
**
** 08/27/2001     J. Falls          Changed "can not" to "cannot".
**
** 10/5/2001      Bill Capone       PT 1217, 1232 and 1233: Added the Functions
**                                  convertTotalTime(), timeCompare(),
**                                  charInBag(), charInString(),
**                                  stripInitialWhitespace(),
**                                  stripEndWhitespace(), stripEdges() and
**                                  nameCompare().
**
** 10/19/2001     Bill Capone       Changed "that the" to "than the".
**
** 10/23/2001     Bill Capone       The description for doLMSSetValue states
**                                  that it returns a boolean.  Modified that
**                                  function to actually return the boolean as
**                                  that boolean was needed in SCO's 6 & 7.
**
** 10/30/2001     Bill Capone       Added the functions stripWhitespace and
**                                  stripCharsInBag.
**
** 10/31/2001     Bill Capone       Removed the function doLMSSetErroneousValue
**                                  as it was never called.
**
** 11/13/2001     Bill Capone       Added the function doLMSSetValueNoPrint.
**
** 11/14/2001     Bill Capone       Modified doLMSGetValue.
**
** 11/27/2001     Jeff Falls        Changed testGetValue to allow for returning
**                                  an error code of 201 or 401
**
** 11/27/2001     Jeff Falls        Changes testSetValue to fail if a mandatory
**                                  element returns a 201, 401, or 404 on an
**                                  invalid value.
**
** 11/27/2001     Jeff Falls        Added a check to make sure a "," exists to
**                                  split on in nameCompare()
**
** 12/06/2001     Bill Capone       Removed extraneous alert window in
**                                  testSetValue().  Updated error code in
**                                  in testSetValue().  Modified stripEdges():
**                                  changed theField.value to theField.
**
**  1/28/2002     S. Thropp         General format updates.  Added code to aid
**                                  in writing the log information to a separate
**                                  file.
**
** 02/11/2002     Bill Capone       Rewrote nameCompare() function.  Removed the
**                                  following, now unneeded, functions:
**                                  charInBag, charInString,
**                                  stripInitialWhitespace, stripEndWhitespace,
**                                  stripEdges.
**
** 05/15/2002     Bill Capone       While researching PT1976 found an error in
**                                  in testGetValue() and testSetValue().
**                                  Changed _WARNING to _FAILED.
**
*******************************************************************************/

// Define exception/error codes
var _NoError = 0;
var _GeneralException = "101";
var _InvalidArgumentError = "201";
var _ElementCannotHaveChildren = "202";
var _ElementIsNotAnArray = "203";
var _NotInitialized = "301";
var _NotImplementedError = "401";
var _InvalidSetValue = "402";
var _ElementIsReadOnly = "403";
var _ElementIsWriteOnly = "404";
var _IncorrectDataType = "405";

var errorMatrix = new Array(12);
errorMatrix[0] = new Array("0", "No error");
errorMatrix[1] = new Array("101", "General Exception");
errorMatrix[2] = new Array("201", "Invalid argument error");
errorMatrix[3] = new Array("202", "Element cannot have children");
errorMatrix[4] = new Array("203", "Element not an array - Cannot have count");
errorMatrix[5] = new Array("301", "Not initialized");
errorMatrix[6] = new Array("401", "Not implemented error");
errorMatrix[7] = new Array("402", "Invalid set value, element is a keyword");
errorMatrix[8] = new Array("403", "Element is read only");
errorMatrix[9] = new Array("404", "Element is write only");
errorMatrix[10] = new Array("405", "Incorrect Data Type");
errorMatrix[11] = new Array("", "");


// page scoped variable definitions
var apiHandle = null;
var API = null;
var findAPITries = 0;

// Data Model Conformance State values
var someOptional = false;
var allOptional = true;
var allMandatory = true;


var _Debug = false;  // set this to false to turn debugging off
                     // to get rid of those annoying alert boxes.

//define the log message type constants
var _INFO = 0;              //  0 = informational (diagnostic, trace, etc.)
var _WARNING = 1;           //  1 = warning
var _PASSED = 2;            //  2 = conformance check passed
var _FAILED = 3;            //  3 = conformance check failure
var _TERMINATE = 4;         //  4 = test suite termination due to nonconformance or error
var _CONFORMANT = 5;        //  5 = subject is found to be conformant
var _OTHER = 9;             //  other
var _NEWSCO = 6;            //  6 = used to indicate that a new sco was launched

// local variable definitions

// we'll track the status of the test using a state variable called scoStatus
// This is set by each SCO as it progresses through the test.
var scoStatus = null;


/*******************************************************************************
**
** Function: writeLogEntry(type, msg)
** Inputs:  type - must be one of the following (constants defined above:
**                      _INFO    - informational (diagnostic, trace, etc.)
**                      _WARNING - warning
**                      _PASSED  - conformance check passed
**                      _FAILED  - conformance check failure
**                      _TERMINATE - terminating due to nonconformance or error
**                      _CONFORMANT - subject is  conformant
**                      _OTHER      - display no icon and use default font.
**          msg - string containing log message
**
** Return:  None
**
**  Description: This function displays a test suite log message.  Note: the
**  LogWriterApplet must be present in the HTML file that this script is
**  included in and be identified by the logWriter object id.
**
*******************************************************************************/
function writeLogEntry(type, msg)
{
   lmsRTEApplet.writeLogEntry(type, msg);
}


/******************************************************************************
**
** Function getAPIHandle()
** Inputs:  None
** Return:  value contained by APIHandle
**
** Description:
** Returns the handle to API object if it was previously set,
** otherwise it returns null
**
*******************************************************************************/
function getAPIHandle()
{
   if (apiHandle == null)
   {
      apiHandle = getAPI();
      if(apiHandle == null)
      {
         writeLogEntry(_FAILED, "Unable to locate LMS's API Adapter - Test Failed");
         lmsRTEApplet.setAPIConformant(false);
         terminateTest();
      }
   }

   return apiHandle;
}

/*******************************************************************************
**
** Function: setAPIHandle(api)
** Inputs:  api (may be null)
** Return:  None
**
**  Description: This function sets the apiHandle variable.  The function
**               looks through the window hierarchy for a variable called API
**               and sets the apiHandle to this object.
**
*******************************************************************************/
function setAPIHandle(api)
{

   if (_Debug)
   {
      alert("in setAPIHandle()");
   }

   if (api == null)
   {

      apiHandle = getAPI();
      if (apiHandle == null)
      {
         handleAPINotFound();
      }
   }
   else
   {
      apiHandle = api;
   }
}


/*******************************************************************************
**
** Function: doLMSInitialize()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitialize()
{
   writeLogEntry(_INFO, "Attempting to call LMSInitialize function");

   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
      return "false";
   }

   var result = api.LMSInitialize("");
   result = result.toString();
   if((result != "true") && (result != "false"))
   {
      lmsRTEApplet.setApiConformant(false);

      logMsg = "LMSInitialize did not return a CMIBoolean value.";
      logMsg += "LMSInitialize returned: &quot;"+result+"&quot;.";
      writeLogEntry(_FAILED, logMsg);

      terminateTest();
      return;
   }
   if (result != "true")
   {
      var err = errorHandler();
      writeLogEntry(_FAILED, "LMSInitialize failed");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   else
   {
      writeLogEntry(_PASSED, "LMSInitialize completed successfully");
   }


   return result;
}


/*******************************************************************************
**
** Function doLMSFinish()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinish()
{

   writeLogEntry(_INFO, "Attempting to call LMSFinish function");

   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
      return "false";
   }
   else
   {
      // call the LMSFinish function that should be implemented by the API
      var result = api.LMSFinish("");
      if (result.toString() != "true")
      {
         var err = errorHandler();
      }
   }

   if (result == "false")
   {
      writeLogEntry(_FAILED, "LMSFinish Failed");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   else
   {
      scoStatus = "completed";
      writeLogEntry(_PASSED, "LMSFinish completed successfully");
   }

   return result.toString();
}

/*******************************************************************************
**
** Function terminateTest()
** Inputs:  None
** Return:  None
**
** Description:
** This function terminates the current test when a non-conformance
** condition is encountered.
**
*******************************************************************************/
function terminateTest()
{
   writeLogEntry(_TERMINATE, "The Test Subject LMS is non conformant");
   teststatus.innerText = "Status:  This SCO Test Terminated.  Please view the log for details.";
   scoStatus = "terminated";
   lmsRTEApplet.setCurrentSCOStatus("terminated");
   lmsRTEApplet.setSessionCompleted(true);
}

/*******************************************************************************
**
** Function handleAPINotFound()
** Inputs:  None
** Return:  None
**
** Description:
** This function is called when the API object is not found, or is null when a
** non-null value is expected.  It logs an appropriate error and terminates the
** current test.
**
*******************************************************************************/
function handleAPINotFound()
{
   writeLogEntry(_FAILED, "Unable to locate the LMS API object");
   lmsRTEApplet.setApiConformant(false);
   terminateTest();
}

/*******************************************************************************
**
** Function isOptionalDMElement(dmElemName)
** Inputs:  dmElemName - string representing the cmi data model defined category
**          or element (e.g. cmi.core.student_id)
** Return:  false -> is a mandatory element
**          true -> is an optional element
**
** Description:
** Determines if a data model element is mandatory or optional.
**
*******************************************************************************/
function isOptionalDMElement(dmElemName)
{
   var man;

   if ( dmElemName == "cmi.core._children" ||
        dmElemName == "cmi.core.student_id" ||
        dmElemName == "cmi.core.student_name" ||
        dmElemName == "cmi.core.lesson_location" ||
        dmElemName == "cmi.core.credit" ||
        dmElemName == "cmi.core.lesson_status" ||
        dmElemName == "cmi.core.entry" ||
        dmElemName == "cmi.core.total_time" ||
        dmElemName == "cmi.core.exit" ||
        dmElemName == "cmi.core.session_time" ||
        dmElemName == "cmi.suspend_data" ||
        dmElemName == "cmi.launch_data" )
   {
      man = false;
   }
   else //it is an optional element
   {
      man = true;
   }

   return man;
}

/*******************************************************************************
**
** Function doLMSGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**             element (e.g. cmi.core.student_id)
** Return:  The value presently assigned by the LMS to the cmi data model
**       element defined by the element or category identified by the name
**       input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method
**
*******************************************************************************/
function doLMSGetValue(name)
{
   var isOptional = isOptionalDMElement(name);
   var logMsg = "LMSGetValue(" + name + ")";

   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetValue was not successful.");
      return "";
   }
   else
   {
      var value = api.LMSGetValue(name);
      var errCode = api.LMSGetLastError().toString();

      if (errCode != _NoError)
      {
         //display the warning or failure
         if ( isOptional )
         {
            logMsg += " for <b>Optional</b> element resulted in the " +
                      "following error: " + doLMSGetErrorString(errCode);
            writeLogEntry(_WARNING, logMsg);
            return "";
         }
         else
         {
            logMsg += " for <b>Mandatory</b> element resulted in the " +
                      "following error: " + doLMSGetErrorString(errCode);
            writeLogEntry(_FAILED, logMsg);
            return "";
         }
      }
      // Special cases with Empty String
      else if (((name == "cmi.launch_data") ||
               (name == "cmi.student_data.max_time_allowed") ||
               (name == "cmi.student_data.mastery_score") ||
               (name == "cmi.student_data.time_limit_action"))
               && (value == ""))
      {
         logMsg += " returned";
         logMsg += ": " + value;
         writeLogEntry(_PASSED, logMsg);
         return value.toString();
      }
      else
      {
         logMsg += " returned";
         if ( lmsRTEApplet.verifyElementType(name, value) != "true")
         {
            logMsg += " a value that is NOT of the correct datatype:  ";
            logMsg += "&quot;" + value + "&quot;";
            writeLogEntry(_FAILED, logMsg);
            return "";
         }
         else
         {
            logMsg += " a value that is of the correct datatype: " + value;
            writeLogEntry(_PASSED, logMsg);
            return value.toString();
         }
      }
   }
}


/*******************************************************************************
**
** Function doLMSSetValue(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function
**
*******************************************************************************/
function doLMSSetValue(name, value)
{
   var logMsg =  "LMSSetValue(" +name+ ", &quot;"+ value+"&quot;)";

   var api = getAPIHandle();

   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
      return false;
   }
   else
   {
      var result = api.LMSSetValue(name, value);

      if (result.toString() != "true")
      {
         //If item is Optional and Not Implemented you will get a failed.
         var errCode = api.LMSGetLastError();
         logMsg += " resulted in the following error: ";
         logMsg += apiHandle.LMSGetErrorString(errCode);

         writeLogEntry(_FAILED, logMsg);
         return false;
      }
      else
      {
         logMsg += " succeeded";
         writeLogEntry(_PASSED, logMsg);
         return true;
      }
   }

   return;
}

/*******************************************************************************
**
** Function doLMSCommit()
** Inputs:  None
** Return:  None
**
** Description:
** Call the LMSCommit function
**
*******************************************************************************/
function doLMSCommit()
{
   writeLogEntry(_INFO, "Attempting to call LMSCommit function");

   var api = getAPIHandle();
   if (api == null)
   {
      // if this happens - the test will already be terminating...
      alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
      return "false";
   }
   else
   {
      var result = api.LMSCommit("");
      if (result != "true")
      {
         var err = errorHandler();
         writeLogEntry(_FAILED, "LMSCommit Failed");
         lmsRTEApplet.setApiConformant(false);

         terminateTest();
      }
      else
      {
         writeLogEntry(_PASSED, "LMSCommit completed successfully");
      }
   }

   return result.toString();
}


/*******************************************************************************
**
** Function doLMSGetLastError()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Call the LMSGetLastError function
**
*******************************************************************************/
function doLMSGetLastError()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralError;
   }

   return api.LMSGetLastError().toString();
}

/*******************************************************************************
**
** Function doLMSGetErrorString(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Call the LMSGetErrorString function
**
********************************************************************************/
function doLMSGetErrorString(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      lmsRTEApplet.setApiConformant(false);
      alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
   }

   var errorString = api.LMSGetErrorString(errorCode).toString();
   // validate that the error string is valid for the error code...
   if(validateErrorString(errorCode, errorString) != true)
   {
      // generate a warning - not a strict conformance requirement...
      var msg = "The LMS returned an invalid error string for error code: ";
      msg += errorCode;
      msg += "<BR>The LMS returned:<BR> ";
      if(errorString == "")
      {
         errorString = "<i><blank></i>";
      }
      msg += errorString;
      msg += "<BR>The LMS should have returned:<BR> ";
      msg += getCorrectErrorString(errorCode);

      writeLogEntry(_WARNING, msg);

   }
   return errorString;
}


/*******************************************************************************
**
** Function getCorrectErrorCode(errorCode)
** Inputs:  errorCode - Error Code String
** Return:  Error String corresponding to the errorCode if found, otherwise ""
**
** Description:
** Returns the Error String corresponding to the errorCode if found, otherwise,
** if the code is invalid, an empty string ("") is returned.
**
********************************************************************************/
function getCorrectErrorString(errorCode)
{

   for(emIdx=0;emIdx<11;emIdx++)
   {
      if(errorMatrix[emIdx][0] == errorCode)
      {
         return errorMatrix[emIdx][1];
      }
   }
   return "";
}


/*******************************************************************************
**
** Function validateErrorCode(errorCode)
** Inputs:  errorCode - Error Code String to validate
** Return:  true if code is valid, otherwise false
**
** Description:
** Determine if the errorCode parameter is a valid API Error Code
**
********************************************************************************/
function validateErrorCode(errorCode)
{
   for(emIdx=0;emIdx<11;emIdx++)
   {
      if(errorMatrix[emIdx][0] == errorCode)
      {
         return true;
      }
   }

   return false;
}


/*******************************************************************************
**
** Function validateErrorString(errorCode, errorString)
** Inputs:  errorCode - Error Code String to use for validating error string
**          errorString - Error String to validate
** Return:  true if errorString is valid, otherwise false
**
** Description:
** Determine if the errorCode parameter is a valid API Error Code
**
********************************************************************************/
function validateErrorString(errorCode, errorString)
{
   for(emIdx=0;emIdx<12;emIdx++)
   {
      if(errorMatrix[emIdx][0] == errorCode)
      {
         if(errorString.toLowerCase() == errorMatrix[emIdx][1].toLowerCase())
         {
            return true;
         }
      }
   }

   return false;
}



/*******************************************************************************
**
** Function doLMSGetDiagnostic(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the
**          input error code
**
** Description:
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnostic(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
      lmsRTEApplet.setApiConformant(false);

   }

   return api.LMSGetDiagnostic(errorCode).toString();
}


/*******************************************************************************
**
** Function errorHandler()
** Inputs:  None
** Return:  The current value of the LMS Error Code
**
** Description:
** Determines if an error was encountered by the previous API call
** and if so, displays a message to the user.  If the error code
** has associated text it is displayed.
**
** Side Effects: Displays an alert window with the appropriate error information
**
*******************************************************************************/
function errorHandler()
{
   if (_Debug)
   {
      alert("in errorHandler()");
   }
   // check for errors caused by or from the LMS

   // Note:  apiHandle should never be null at this point, but check to be sure
   if (apiHandle != null)
   {
      var errCode = apiHandle.LMSGetLastError();

      if (errCode != _NoError)
      {
         // an error was encountered so display the error description
         var errDescription = apiHandle.LMSGetErrorString(errCode);
         errDescription += "<BR>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Diagnostic:  ";
         errDescription += apiHandle.LMSGetDiagnostic(errCode);
         writeLogEntry(_FAILED, "The following error was encountered:   " + errDescription);
      }

      return errCode;
   }
   else
   {
      writeLogEntry( _OTHER, "Unable to determine LMS Error Code. API is unexpectedly null.  Terminating Test.");
      terminateTest();
      return _GeneralException;
   }
}


/*******************************************************************************
**
** Function findAPI(win)
** Inputs:  win - a Window Object
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API in parent and opener windows
**
*******************************************************************************/
function findAPI(win)
{
   while ((win.API == null) && (win.parent != null) && (win.parent != win))
   {
      findAPITries++;

      // Note: 500 is a number that comes from the new IEEE API standard.
      //       See rational in ticket number 3547
      if (findAPITries > 500)
      {
         alert("Error finding API -- too deeply nested.");
         return null;
      }

      win = win.parent;

   }
   return win.API;
}


/*******************************************************************************
**
** Function getAPI()
** Inputs:  none
** Return:  If an API object is found, it's returned, otherwise null is returned
**
** Description:
** This function looks for an object named API, first in the current window's
** frame hierarchy and then, if necessary, in the current window's opener window
** hierarchy (if there is an opener window).
**
*******************************************************************************/
function getAPI()
{
   var theAPI = findAPI(window);
   if ((theAPI == null) && (window.opener != null) && (typeof(window.opener) != "undefined"))
   {
      theAPI = findAPI(window.opener);
   }
   if (theAPI == null)
   {
      alert("Unable to find an API adapter");
   }
   return theAPI
}


/*******************************************************************************
**
** Function isLaunchedInOrder()
** Inputs:  course - indicates the course number
**          sco - indicates the sco number
** Return:  boolean - false if the SCO was launched out of sequence
**                    true if the SCO was launched in sequence
**
** Description:  This function determines if an SCO was launched in the order
**               specified by the seq input value
*******************************************************************************/
function isLaunchedInOrder(course, sco)
{
   if (_Debug)
   {
      alert("in isLaunchedInOrder - sco is" + sco);
   }

   var counter;

   if(course == 1)
   {
      counter = lmsRTEApplet.getCourseOneCurrentSCOIndex();
   }
   else
   {
      counter = lmsRTEApplet.getCourseTwoCurrentSCOIndex();
   }

   counter++;

   if (_Debug)
   {
      alert("just got sequence counter - incremented counter is now: " + counter);
   }
   if (counter+1 != sco)
   {
      //alert("This SCO was launched out of sequence!");
      return false;
   }
   else
   {
      if(course == 1)
      {

         lmsRTEApplet.setCourseOneCurrentSCOIndex(counter);
      }
      else
      {
         lmsRTEApplet.setCourseTwoCurrentSCOIndex(counter);
      }

      return true;
   }
}


/*******************************************************************************
**
** Function testLaunch(course, sco)
** Inputs: course - number of test course(1 or 2)
**         sco - test sco number (e.g. 1, 2, etc.)
** Return:  None
**
** Description:  This function determines if an SCO was launched correctly
*******************************************************************************/
function testLaunch(course, sco)
{

   if (_Debug)
   {
      alert("in testLaunch()");
   }

   if ( (course==1) && (sco==1) )
   {
      writeLogEntry(_NEWSCO, "*****************************");
      writeLogEntry(_NEWSCO, "      Executing Course 1   ");
      writeLogEntry(_NEWSCO, "*****************************");
      writeLogEntry(_NEWSCO, "");
   }
   else if ( (course==2) && (sco==1) )
   {
      writeLogEntry(_NEWSCO, "*****************************");
      writeLogEntry(_NEWSCO, "      Executing Course 2   ");
      writeLogEntry(_NEWSCO, "*****************************");
      writeLogEntry(_NEWSCO, "");
   }

   // Verify Launch Test Criteria

   // If we get to this point, assume that the SCO has been launched by the LMS.

   // the LMS was able to launch at least one SCO...
   lmsRTEApplet.setLaunchConformant(true);

   writeLogEntry(_NEWSCO, "*****************************");
   writeLogEntry(_NEWSCO, "      Testing SCO 0"+sco+" ");
   writeLogEntry(_NEWSCO, "*****************************");
   writeLogEntry(_NEWSCO, "");

   var scolink = "c" + course + "s" + sco;

   writeLogEntry(_OTHER, "");
   writeLogEntry(_INFO, "<a name=\""+scolink+"\">*****************************");
   writeLogEntry(_INFO, "              SCO 0"+sco+" has been launched.");
   writeLogEntry(_INFO, "*****************************</a>");

   // Is this SCO launched in the specified test sequence?

   writeLogEntry(_INFO, "Validating SCO launch sequence.");
   if (isLaunchedInOrder(course, sco) != true)
   {
      // The SCO was launched in the wrong order

      var launchMessage = "This SCO was not launched in the correct sequence.\n";
      launchMessage += "Click OK if the SCO was launched automatically by the LMS.\n";
      launchMessage += "Click Cancel if the SCO was launched by the user.";

      /*if (confirm(launchMessage))
      {
         writeLogEntry(_FAILED, "The LMS did not launch the SCO in the appropriate sequence.");
         lmsRTEApplet.setAPIConformant(false);
      }
      else
      {*/
         // must have been operator error?
         writeLogEntry(_FAILED, "The operator did not launch the SCO in the appropriate sequence.");
         lmsRTEApplet.setAPIConformant(false);
      //}
   }
   else
   {
      writeLogEntry(_PASSED, "The SCO has been launched in the appropriate sequence.");

   }

   lmsRTEApplet.setCurrentSCO(course, sco-1);
}

/*******************************************************************************
**
** Function getCMIDateToday()
** Inputs:  None
** Return:  Current Date in CMIDate format
**
** Description:
** This function returns the current date in CMIDate format
**
*******************************************************************************/
function getCMIDateToday()
{

   if(_Debug)
   {
      alert("In getCMIDateToday()");
   }

   var todayDate = new Date();

   var theMonth = todayDate.getMonth();
   theMonth++;   // the month is zero based
   if(theMonth < 10)
   {
      theMonth = "0" + theMonth;
   }

   var theDay = todayDate.getDate();
   if(theDay < 10)
   {
      theDay = "0" + theDay;
   }
   var cmiDateToday = todayDate.getYear() + "/";
   cmiDateToday += theMonth + "/";
   cmiDateToday += theDay;

   if(_Debug)
   {
      alert("Today's CMI Date is: "+ cmiDateToday);
   }

   return cmiDateToday;
}

/******************************************************************************
** Function testGetValue(name)
** Inputs:  name - string representing the cmi data model defined category or
**                 element (e.g. cmi.core.student_id)
**          index - indicates the index into the Data Model matrix to be tested
** Return:  The value presently assigned by the LMS to the cmi data model
**          element defined by the element or category identified by the name
**          input value.
**
** Description:
** Wraps the call to the LMS LMSGetValue method.
**
******************************************************************************/
function testGetValue(name, index)
{
   if(_Debug)
   {
      alert("in testGetValue() - name is: "+ name);
   }

   // handle only the readable data model elements
   if(dataModelMatrix[index][1] == _W)
   {
      return "";
   }

   var logMsg = "LMSGetValue(" + name + ") ";

   var value;


   // assume element is not implemented correctly
   dataModelMatrix[index][4] = false;

   value = apiHandle.LMSGetValue(name);


   err = apiHandle.LMSGetLastError();

   // If the error code is something other than 0 - No Error
   // Then check to see if this is a Conformance Failure
   if(err != _NoError)
   {
      // LMS returned something other than 0 - No Error, this indicates
      // an error was encountered
      // If the error returned is 401 - Not Implemented or 201 - Invalid
      // argument error
      if (( err == _NotImplementedError) || ( err == _InvalidArgumentError))
      {
         // Check to see if the element being tested is mandatoy
         if(dataModelMatrix[index][2] == true)
         {
            // Data Model element being tested is mandatory and the LMS
            // did not handle the LMSGetValue() request correctly
            logMsg += " for <b>Mandatory</b> element resulted in the " +
                  "following error: " + doLMSGetErrorString(err);
            allMandatory = false;
            writeLogEntry(_FAILED, logMsg);
         }
         else
         {
            // Data Model element being tested is optional and the LMS
            // handle the LMSGetValue() request correctly
            logMsg += " for <b>Optional</b> element resulted in the " +
                  "following error: " + doLMSGetErrorString(err);
            allOptional = false;
            writeLogEntry(_WARNING, logMsg);
         }
      }
      else
      {
         // log the error
         logMsg += " resulted in the following error: ";
         logMsg += doLMSGetErrorString(err).toString();
         writeLogEntry(_FAILED, logMsg);
         return;
      }

      return "";
   }
   else
   {
      // a value was returned with no error - so verify the return type
      logMsg += "returned";

      // Special cases with Empty String
      if ( ( (name == "cmi.launch_data") ||
             (name == "cmi.student_data.max_time_allowed") ||
             (name == "cmi.student_data.mastery_score") ||
             (name == "cmi.student_data.time_limit_action") ) &&
             (value == "") )
      {
         logMsg += ":  &quot;" + value.toString() + "&quot;";
         if(dataModelMatrix[index][2] != true)
         {
            someOptional = true;
         }
         // element is implemented correctly
         dataModelMatrix[index][4] = true;
         writeLogEntry(_PASSED, logMsg);

         return value.toString();
      }
      else
      {
         // The LMS handled the call to LMSGetValue() correctly.  Verify
         // that the value returned by the LMS is appropriate data type
         // and meets the requirements defined in the SCORM
         if(lmsRTEApplet.verifyElementType(name, value) != "true")
         {
            // Value returned by the LMS is not the correct data type
            logMsg += " a value that is NOT of the correct datatype:  ";
            logMsg += "&quot;" + value.toString() + "&quot;";
            writeLogEntry(_FAILED, logMsg);

            // If the Data Model element is mandatory
            if(dataModelMatrix[index][2] == true)
            {
               // Set the flag that all mandatory data model elements
               // were not handled correctly
               allMandatory = false;
            }
            else
            {
               // Set the flag that all optional data model elements
               // were not handled correctly
               allOptional = false;
            }

            return "";
         }
         else
         {
            // LMS returned a valid value that meets the requirements
            // defined in the SCORM
            logMsg += ":  &quot;" + value.toString() + "&quot;";

            // Data model element is optional set flag indicating that
            // some optional elements were implemented correctly
            if(dataModelMatrix[index][2] != true)
            {
               someOptional = true;
            }
            // element is implemented correctly
            dataModelMatrix[index][4] = true;
            writeLogEntry(_PASSED, logMsg);

            return value.toString();
         }
      }
   }
}

/*******************************************************************************
** Function testSetValue(name, value)
** Inputs:  name - string representing the cmi data model defined category or element
**          value - the value that the named element or category will be assigned
** Return:  None
**
** Description:
** Wraps the call to the LMS LMSSetValue method
**
*******************************************************************************/
function testSetValue(name, value, index)
{

   // handle only the writeable data model elements
   if(dataModelMatrix[index][1] == _R)
   {
      return;
   }

   var logMsg =  "LMSSetValue(" +name+ ", &quot;"+ value+"&quot;)";

   // Ask the LMS to set the data model element with the value provided
   var result = apiHandle.LMSSetValue(name, value);

   // If the LMSSetValue() failed determine whether or not the LMS
   // handled the call correctly
   if(result != "true")
   {
      // Get the API error code
      var err = apiHandle.LMSGetLastError();

      // Check the error code
      if(err != _NoError)
      {
         // Error code was not 0 - No error (which it should not be
         // since a "false" was returned by the LMS.
         if((err == _NotImplementedError) ||
            (err == _InvalidArgumentError))
         {
            // Error code was set to 401 - Not implemented or 201 - Invalid
            // argument error
            // Check to determine if the data model element is mandatory
            if(dataModelMatrix[index][2] == true)
            {
               // Element was mandatory and the LMS did not handle the
               // LMSSetValue() correctly
               logMsg += " for <b>Mandatory</b> element resulted in the " +
                     "following error: "  + doLMSGetErrorString(err);
               allMandatory = false;

               writeLogEntry(_FAILED, logMsg);
            }
            else
            {
               // Element was optional and was not handled by the LMS. Set
               // the all optional flag to false to indicate that the LMS
               // does not handle all optional elements
               logMsg += " for <b>Optional</b> element resulted in the " +
                     "following error: " + doLMSGetErrorString(err);
               allOptional = false;
               writeLogEntry(_WARNING, logMsg);
            }
            return;

         }
         else
         {
            // log the error
            logMsg += " resulted in the following error: ";
            logMsg += doLMSGetErrorString(err).toString();
            writeLogEntry(_FAILED, logMsg);
            return;
         }
      }
   }
   else
   {
      // LMSSetValue() all was handled correctly by the LMS
      // Check to see if the element is optional
      if(dataModelMatrix[index][2] != true)
      {
         // Set a flag to indicate that some of the optional data model
         // elements were handled correctly
         someOptional = true;
      }
   }

   // element is implemented correctly
   dataModelMatrix[index][4] = true;
   logMsg += " succeeded";
   writeLogEntry(_PASSED, logMsg);

   return;
}


/*******************************************************************************
** Function compareReadWriteValues(readVal, index)
** Inputs:  readVal - value read from the LMS
**          index - dataModelMatrix index of element
** Outputs: none
**
** Description: Determines if the value passed back from the LMS is the same
**              as the value previously set by the SCO.
*******************************************************************************/
function compareReadWriteValues(readVal, index)
{
   // check - only if the element is implemented correctly
   if(dataModelMatrix[index][4] == true)
   {
      if(dataModelMatrix[index][3] != readVal)
      {
         var logMsg = "The LMS returned a value that is different than the ";
         logMsg += "previously set value for ";


         if(dataModelMatrix[index][2] == true) // mandatory element
         {
            logMsg += " <b>Mandatory</b> element ";
            allMandatory = false;
         }
         else   // optional element
         {
            logMsg += " <b>Optional</b> element ";
            allOptional = false;
         }
         logMsg += dataModelMatrix[index][0];
         logMsg += "<br>Expected value: &quot;" + dataModelMatrix[index][3];
         logMsg += "&quot;<br>LMS Returned: &quot;" + readVal;
         logMsg += "&quot;";
         writeLogEntry(_FAILED, logMsg);
      }
   }

   return;
}


/*******************************************************************************
** Function setDMStatus()
** Inputs:  none
** Outputs: none
**
** Description:
** Persists the data model conformance state values after a SCO is done testing
** data model elements
*******************************************************************************/
function setDMStatus()
{
   if(someOptional == true)
   {
      lmsRTEApplet.setDMSomeOptional(true);
   }

   if(allOptional == false)
   {
      lmsRTEApplet.setDMAllOptional(false);
   }

   if(allMandatory == false)
   {
      lmsRTEApplet.setDMMandatory(false);
   }
}

/*******************************************************************************
**
** Function convertTotalTime(course, sco)
** Inputs: totalTime - value of cmi.core.total_time in the calling fuction
** Return:  value in Milliseconds
**
** Description:  Convert totalTime to seconds, with the tenths and hundreds of
**               inputted seconds returned as the decimal portion of the return.
*******************************************************************************/
function convertTotalTime(totalTime)
{
   var lTotalTime = 0.0;
   var numArray;
   var hourVal, minVal, secVal;

   numArray = totalTime.split(":");
   hourVal = parseFloat(numArray[0]);
   hourVal *= 3600; //3600 equals 60 times 60 (hours times minutes)

   minVal = parseFloat(numArray[1]);
   minVal *= 60;

   secVal = parseFloat(numArray[2]);

   lTotalTime = hourVal + minVal + secVal;

   return lTotalTime;
}
/*******************************************************************************
**
** Function timeCompare(course, sco)
** Inputs: time1 - Value of first time to compare
**         time2 - Value to compare against time1
** Return:  Boolean value: True - They are equal
**                         False - They are NOT equal
**
** Description:  Compare time1 against time2
*******************************************************************************/
function timeCompare(time1, time2)
{
   var convertedTime1, convertedTime2;

   convertedTime1 = convertTotalTime(time1);
   convertedTime2 = convertTotalTime(time2);

   if (convertedTime1 == convertedTime2)
   {
      return true;
   }
   else
   {
      return false;
   }
}

/*******************************************************************************
**
** Function stripCharsInBag(s, bag)
** Inputs: s - String to check
**         bag - character that you're checking to see if it exists
** Return:  String without any of the characters passed in as argument 'bag'
**
** Description:  Strips the character 'bag' from the string.
*******************************************************************************/
function stripCharsInBag (s, bag)
{
   var i;
   var returnString = "";
   for (i = 0; i < s.length; i++)
   {
      var c = s.charAt(i);
      if (bag.indexOf(c) == -1) returnString += c;
   }
   return returnString;
}

/*******************************************************************************
**
** Function stripWhitespace (s)
** Inputs: s - String that you wish to strip the whitepsace from.
** Return:  String without any whitespace
**
** Description:  By calling stripCharsInBag with the argument 'whitespace' this
**       function strips any whitespace from the string.
*******************************************************************************/
function stripWhitespace (s)
{
   var whitespace = " \t\n\r";
   return stripCharsInBag (s, whitespace)
}

/*******************************************************************************
**
** Function nameCompare(course, sco)
** Inputs: name1 - Value of first name to compare
**         name2 - Value to compare against name1
** Return:  Boolean value: True - They are equal
**                         False - They are NOT equal
**
** Description:  Compare name1 against name2.  It is expected that the format
**               of the name is lastname,firstname.
*******************************************************************************/
function nameCompare(name1, name2)
{
   var nameArray1, nameArray2;
   //Various whitespace characters
   var re = /[ \t\r\n]*/g;

   if ( name1.indexOf(",") == -1 )
   {
      return false;
   }

   //After the .split the [0] element will contain the Last Name of the Student
   //and the [1] element will contain the First Name of the Student
   nameArray1 = name1.split(",");
   nameArray2 = name2.split(",");

   //Remove whitespace characters
   nameArray1[0] = nameArray1[0].replace(re,"");
   nameArray1[1] = nameArray1[1].replace(re,"");
   nameArray2[0] = nameArray2[0].replace(re,"");
   nameArray2[1] = nameArray2[1].replace(re,"");

   //If both first names match AND both last names match return true
   if ((nameArray1[0].toUpperCase() == nameArray2[0].toUpperCase()) &&
       (nameArray1[1].toUpperCase() == nameArray2[1].toUpperCase()))
   {
      return true;
   }
   else
   {
      return false;
   }
}

/*******************************************************************************
**
** Function doLMSSetValueNoPrint(name, value)
** Inputs:  name -string representing the data model defined category or element
**          value -the value that the named element or category will be assigned
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Wraps the call to the LMS LMSSetValue function.  Unlike doLMSSetValue, this
** function does not print a message to the log.
**
*******************************************************************************/
function doLMSSetValueNoPrint(name, value)
{

   var api = getAPIHandle();

   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSSetValue was not successful.");
      return false;
   }
   else
   {
      var result = api.LMSSetValue(name, value);

      if (result.toString() != "true")
      {
         return false;
      }
      else
      {
         return true;
      }
   }
}

/*******************************************************************************
**
** Function: doLMSInitializeTest()
** Inputs:  None
** Return:  CMIBoolean true if the initialization was successful, or
**          CMIBoolean false if the initialization failed.
**
** Description:
** Same as the doLMSInitialize() function, but is called only the first
** time LMSInitialize is invoked - determines if the method exists and, if not,
** catches the exception and reports that as an error.
** Initialize communication with LMS by calling the LMSInitialize
** function which will be implemented by the LMS.
**
*******************************************************************************/
function doLMSInitializeTest()
{
   writeLogEntry(_INFO, "Attempting to call LMSInitialize function");

   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSInitialize was not successful.");
      return "false";
   }

   var result = "";
   var passed = true;
   try
   {
      result = api.LMSInitialize("");
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSInitialize found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSInitialize NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   
   result = result.toString();
   if((result != "true") && (result != "false"))
   {
      lmsRTEApplet.setApiConformant(false);

      logMsg = "LMSInitialize did not return a CMIBoolean value.";
      logMsg += "LMSInitialize returned: &quot;"+result+"&quot;.";
      writeLogEntry(_FAILED, logMsg);

      terminateTest();
      return;
   }
   if (result != "true")
   {
      var err = errorHandler();
      writeLogEntry(_FAILED, "LMSInitialize failed");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   else
   {
      writeLogEntry(_PASSED, "LMSInitialize completed successfully");
   }


   return result;
}

/*******************************************************************************
**
** Function doLMSFinishTest()
** Inputs:  None
** Return:  CMIBoolean true if successful
**          CMIBoolean false if failed.
**
** Description:
** Same as the doLMSFinish() function, but is called only the first
** time LMSFinish is invoked - determines if the method exists and, if not,
** catches the exception and reports that as an error.
** Close communication with LMS by calling the LMSFinish
** function which will be implemented by the LMS
**
*******************************************************************************/
function doLMSFinishTest()
{

   writeLogEntry(_INFO, "Attempting to call LMSFinish function");

   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSFinish was not successful.");
      return "false";
   }
   else
   {
      // call the LMSFinish function that should be implemented by the API
      var result = "";
      var passed = true;
      try
      {
         result = api.LMSFinish("");
      }
      catch(e)
      {
         passed = false;
      }
      if (passed == true)
      {
         writeLogEntry(_PASSED, "LMSFinish found.");
      }
      else
      {
         writeLogEntry(_FAILED, "LMSFinish NOT found.");
         lmsRTEApplet.setApiConformant(false);
         terminateTest();
      }
      
      if (result.toString() != "true")
      {
         var err = errorHandler();
      }
   }

   if (result == "false")
   {
      writeLogEntry(_FAILED, "LMSFinish Failed");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   else
   {
      scoStatus = "completed";
      writeLogEntry(_PASSED, "LMSFinish completed successfully");
   }

   return result.toString();
}

/******************************************************************************
** Function testGetValueTest(name)
** Inputs:  name - string representing the cmi data model defined category or
**                 element (e.g. cmi.core.student_id)
**          index - indicates the index into the Data Model matrix to be tested
** Return:  The value presently assigned by the LMS to the cmi data model
**          element defined by the element or category identified by the name
**          input value.
**
** Description:
** Same as the testGetValue() function, but is called only the first
** time LMSGetValue is invoked - determines if the method exists and, if not,
** catches the exception and reports that as an error.
** Wraps the call to the LMS LMSGetValue method.
**
******************************************************************************/
function testGetValueTest(name, index)
{
   if(_Debug)
   {
      alert("in testGetValue() - name is: "+ name);
   }

   // handle only the readable data model elements
   if(dataModelMatrix[index][1] == _W)
   {
      return "";
   }

   var logMsg = "LMSGetValue(" + name + ") ";

   var value;


   // assume element is not implemented correctly
   dataModelMatrix[index][4] = false;

   var value = "";
   var passed = true;
   try
   {
      value = apiHandle.LMSGetValue(name);
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSGetValue found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSGetValue NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }

   err = apiHandle.LMSGetLastError();

   // If the error code is something other than 0 - No Error
   // Then check to see if this is a Conformance Failure
   if(err != _NoError)
   {
      // LMS returned something other than 0 - No Error, this indicates
      // an error was encountered
      // If the error returned is 401 - Not Implemented or 201 - Invalid
      // argument error
      if (( err == _NotImplementedError) || ( err == _InvalidArgumentError))
      {
         // Check to see if the element being tested is mandatoy
         if(dataModelMatrix[index][2] == true)
         {
            // Data Model element being tested is mandatory and the LMS
            // did not handle the LMSGetValue() request correctly
            logMsg += " for <b>Mandatory</b> element resulted in the " +
                  "following error: " + doLMSGetErrorString(err);
            allMandatory = false;
            writeLogEntry(_FAILED, logMsg);
         }
         else
         {
            // Data Model element being tested is optional and the LMS
            // handle the LMSGetValue() request correctly
            logMsg += " for <b>Optional</b> element resulted in the " +
                  "following error: " + doLMSGetErrorString(err);
            allOptional = false;
            writeLogEntry(_WARNING, logMsg);
         }
      }
      else
      {
         // log the error
         logMsg += " resulted in the following error: ";
         logMsg += doLMSGetErrorString(err).toString();
         writeLogEntry(_FAILED, logMsg);
         return;
      }

      return "";
   }
   else
   {
      // a value was returned with no error - so verify the return type
      logMsg += "returned";

      // Special cases with Empty String
      if ( ( (name == "cmi.launch_data") ||
             (name == "cmi.student_data.max_time_allowed") ||
             (name == "cmi.student_data.mastery_score") ||
             (name == "cmi.student_data.time_limit_action") ) &&
             (value == "") )
      {
         logMsg += ":  &quot;" + value.toString() + "&quot;";
         if(dataModelMatrix[index][2] != true)
         {
            someOptional = true;
         }
         // element is implemented correctly
         dataModelMatrix[index][4] = true;
         writeLogEntry(_PASSED, logMsg);

         return value.toString();
      }
      else
      {
         // The LMS handled the call to LMSGetValue() correctly.  Verify
         // that the value returned by the LMS is appropriate data type
         // and meets the requirements defined in the SCORM
         if(lmsRTEApplet.verifyElementType(name, value) != "true")
         {
            // Value returned by the LMS is not the correct data type
            logMsg += " a value that is NOT of the correct datatype:  ";
            logMsg += "&quot;" + value.toString() + "&quot;";
            writeLogEntry(_FAILED, logMsg);

            // If the Data Model element is mandatory
            if(dataModelMatrix[index][2] == true)
            {
               // Set the flag that all mandatory data model elements
               // were not handled correctly
               allMandatory = false;
            }
            else
            {
               // Set the flag that all optional data model elements
               // were not handled correctly
               allOptional = false;
            }

            return "";
         }
         else
         {
            // LMS returned a valid value that meets the requirements
            // defined in the SCORM
            logMsg += ":  &quot;" + value.toString() + "&quot;";

            // Data model element is optional set flag indicating that
            // some optional elements were implemented correctly
            if(dataModelMatrix[index][2] != true)
            {
               someOptional = true;
            }
            // element is implemented correctly
            dataModelMatrix[index][4] = true;
            writeLogEntry(_PASSED, logMsg);

            return value.toString();
         }
      }
   }
}

/*******************************************************************************
** Function testSetValueTest(name, value)
** Inputs:  name - string representing the cmi data model defined category or element
**          value - the value that the named element or category will be assigned
** Return:  None
**
** Description:
** Same as the testSetValue() function, but is called only the first
** time LMSSetValue is invoked - determines if the method exists and, if not,
** catches the exception and reports that as an error.
** Wraps the call to the LMS LMSSetValue method
**
*******************************************************************************/
function testSetValueTest(name, value, index)
{
   // handle only the writeable data model elements
   if(dataModelMatrix[index][1] == _R)
   {
      return;
   }

   var logMsg =  "LMSSetValue(" +name+ ", &quot;"+ value+"&quot;)";
   
   var result = "";
   var passed = true;
   try
   {
      // Ask the LMS to set the data model element with the value provided
      result = apiHandle.LMSSetValue(name, value);
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSSetValue found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSSetValue NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }

   // If the LMSSetValue() failed determine whether or not the LMS
   // handled the call correctly
   if(result.toString() != "true")
   {
      // Get the API error code
      var err = apiHandle.LMSGetLastError();

      // Check the error code
      if(err != _NoError)
      {
         // Error code was not 0 - No error (which it should not be
         // since a "false" was returned by the LMS.
         if((err == _NotImplementedError) ||
            (err == _InvalidArgumentError))
         {
            // Error code was set to 401 - Not implemented or 201 - Invalid
            // argument error
            // Check to determine if the data model element is mandatory
            if(dataModelMatrix[index][2] == true)
            {
               // Element was mandatory and the LMS did not handle the
               // LMSSetValue() correctly
               logMsg += " for <b>Mandatory</b> element resulted in the " +
                     "following error: "  + doLMSGetErrorString(err);
               allMandatory = false;

               writeLogEntry(_FAILED, logMsg);
            }
            else
            {
               // Element was optional and was not handled by the LMS. Set
               // the all optional flag to false to indicate that the LMS
               // does not handle all optional elements
               logMsg += " for <b>Optional</b> element resulted in the " +
                     "following error: " + doLMSGetErrorString(err);
               allOptional = false;
               writeLogEntry(_WARNING, logMsg);
            }
            return;

         }
         else
         {
            // log the error
            logMsg += " resulted in the following error: ";
            logMsg += doLMSGetErrorString(err).toString();
            writeLogEntry(_FAILED, logMsg);
            return;
         }
      }
   }
   else
   {
      // LMSSetValue() all was handled correctly by the LMS
      // Check to see if the element is optional
      if(dataModelMatrix[index][2] != true)
      {
         // Set a flag to indicate that some of the optional data model
         // elements were handled correctly
         someOptional = true;
      }
   }

   // element is implemented correctly
   dataModelMatrix[index][4] = true;
   logMsg += " succeeded";
   writeLogEntry(_PASSED, logMsg);

   return;
}

/*******************************************************************************
**
** Function doLMSCommitTest()
** Inputs:  None
** Return:  None
**
** Description:
** Same as the doLMSCommit() function, but is called only the first
** time LMSCommit is invoked - determines if the method exists and, if not,
** catches the exception and reports that as an error.
** Call the LMSCommit function
**
*******************************************************************************/
function doLMSCommitTest()
{
   writeLogEntry(_INFO, "Attempting to call LMSCommit function");

   var api = getAPIHandle();
   if (api == null)
   {
      // if this happens - the test will already be terminating...
      alert("Unable to locate the LMS's API Implementation.\nLMSCommit was not successful.");
      return "false";
   }
   else
   {
      var result = "";
      var passed = true;
      try
      {
         result = api.LMSCommit("");
      }
      catch(e)
      {
         passed = false;
      }
      if (passed == true)
      {
         writeLogEntry(_PASSED, "LMSCommit found.");
      }
      else
      {
         writeLogEntry(_FAILED, "LMSCommit NOT found.");
         lmsRTEApplet.setApiConformant(false);
         terminateTest();
      }
      
      if (result != "true")
      {
         var err = errorHandler();
         writeLogEntry(_FAILED, "LMSCommit Failed");
         lmsRTEApplet.setApiConformant(false);

         terminateTest();
      }
      else
      {
         writeLogEntry(_PASSED, "LMSCommit completed successfully");
      }
   }

   return result.toString();
}

/*******************************************************************************
**
** Function doLMSGetLastErrorTest()
** Inputs:  None
** Return:  The error code that was set by the last LMS function call
**
** Description:
** Same as the doLMSGetLastError() function, but is called only the first
** time LMSGetLastError is invoked - determines if the method exists and, if
** not,catches the exception and reports that as an error.
** Call the LMSGetLastError function
**
*******************************************************************************/
function doLMSGetLastErrorTest()
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetLastError was not successful.");
      //since we can't get the error code from the LMS, return a general error
      return _GeneralError;
   }

   var errorCode = "";
   var passed = true;
   try
   {
      errorCode = api.LMSGetLastError();
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSGetLastError found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSGetLastError NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   
   return errorCode.toString();
}

/*******************************************************************************
**
** Function doLMSGetErrorStringTest(errorCode)
** Inputs:  errorCode - Error Code
** Return:  The textual description that corresponds to the input error code
**
** Description:
** Same as the doLMSGetErrorString() function, but is called only the first
** time LMSGetErrorString is invoked - determines if the method exists and, if\
** not, catches the exception and reports that as an error.
** Call the LMSGetErrorString function
**
********************************************************************************/
function doLMSGetErrorStringTest(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      lmsRTEApplet.setApiConformant(false);
      alert("Unable to locate the LMS's API Implementation.\nLMSGetErrorString was not successful.");
   }

   var errorString = "";
   var passed = true;
   try
   {
      errorString = api.LMSGetErrorString(errorCode).toString();
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSGetErrorString found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSGetErrorString NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   
   // validate that the error string is valid for the error code...
   if(validateErrorString(errorCode, errorString) != true)
   {
      // generate a warning - not a strict conformance requirement...
      var msg = "The LMS returned an invalid error string for error code: ";
      msg += errorCode;
      msg += "<BR>The LMS returned:<BR> ";
      if(errorString == "")
      {
         errorString = "<i><blank></i>";
      }
      msg += errorString;
      msg += "<BR>The LMS should have returned:<BR> ";
      msg += getCorrectErrorString(errorCode);

      writeLogEntry(_WARNING, msg);

   }
   return errorString;
}

/*******************************************************************************
**
** Function doLMSGetDiagnosticTest(errorCode)
** Inputs:  errorCode - Error Code(integer format), or null
** Return:  The vendor specific textual description that corresponds to the
**          input error code
**
** Description:
** Same as the the doLMSGetDiagnostic() function, but is called only the first
** time LMSGetDiagnostic is invoked - determines if the method exists and, if
** not,catches the exception and reports that as an error.
** Call the LMSGetDiagnostic function
**
*******************************************************************************/
function doLMSGetDiagnosticTest(errorCode)
{
   var api = getAPIHandle();
   if (api == null)
   {
      alert("Unable to locate the LMS's API Implementation.\nLMSGetDiagnostic was not successful.");
      lmsRTEApplet.setApiConformant(false);
   }
   
   var result = "";
   var passed = true;
   try
   {
      result = api.LMSGetDiagnostic(errorCode);
   }
   catch(e)
   {
      passed = false;
   }
   if (passed == true)
   {
      writeLogEntry(_PASSED, "LMSGetDiagnostic found.");
   }
   else
   {
      writeLogEntry(_FAILED, "LMSGetDiagnostic NOT found.");
      lmsRTEApplet.setApiConformant(false);
      terminateTest();
   }
   
   return result.toString();
}

