/**
 * This file is part of Moodle - http://moodle.org/
 * Moodle is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * at your option) any later version.
 * 
 * Moodle is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Moodle.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @author    Mayank Gupta
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import java.io.IOException;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import org.openqa.selenium.ie.InternetExplorerDriver;
import org.openqa.selenium.support.ui.ExpectedCondition;
import org.openqa.selenium.support.ui.Wait;
import org.openqa.selenium.support.ui.WebDriverWait;

public class scormADL12 {
	private InternetExplorerDriver driver;
	private Wait<WebDriver> wait;
	private int currentSCO = 1;
	@Before
	public void setUp() {
		driver = new InternetExplorerDriver();
	    wait = new WebDriverWait(driver, 60);
	}
	/**
	 *  Open TestSuite and Moodle site
	 * @throws IOException
	 */
	public void testSetup() throws IOException {
		String testSuiteURL = System.getProperty("testSuiteURL");
		String moodleURL = System.getProperty("moodleURL");
		if (testSuiteURL == null) {
			throw new IOException("ADL SCORM 1.2 Test Suite URL not specified");
		} 
		if (moodleURL == null) {
			throw new IOException("Moodle Test Site URL not specified");
		}
		driver.get(testSuiteURL);
		driver.switchTo().frame("instructions");
		driver.findElement(By.id("pname")).sendKeys("Moodle");
		driver.findElement(By.id("pversion")).sendKeys("2.3");
		driver.findElement(By.id("pvname")).sendKeys("MoodleHQ");
		driver.findElement(By.id("continue01")).click();
		((JavascriptExecutor) driver).executeScript("window.open('"+moodleURL+"', 'moodleWindow');");
		driver.switchTo().window("moodleWindow");
	}
	/**
	 *  Login into ADL SCORM Test Course
	 * @param course
	 */
	public void loginCourse(int course) {
		driver.findElement(By.linkText("SCORM 1.2 ADL Test course")).click();
		wait.until(presenceOfElementLocated(By.id("username")));
		driver.findElement(By.id("username")).clear();
		driver.findElement(By.id("password")).clear();
		if (course != 2) {
			driver.findElement(By.id("username")).sendKeys("joestudent");
			driver.findElement(By.id("password")).sendKeys("joestudent");
		} else {
			driver.findElement(By.id("username")).sendKeys("marylearner");
			driver.findElement(By.id("password")).sendKeys("marylearner");
		}
		driver.findElement(By.id("loginbtn")).click();
		wait.until(presenceOfElementLocated(By.xpath("//span[text()='LMSTestCourse01']")));
		if (course != 1) {
			driver.findElement(By.xpath("//span[text()='LMSTestCourse02']")).click();
		} else {
			driver.findElement(By.xpath("//span[text()='LMSTestCourse01']")).click();
		}
	}
	/**
	 *  Test all SCOes
	 * @param mode
	 * @param course
	 * @param scoLeft
	 */
	public void testSCO (char mode, int course, int scoLeft) {
		wait.until(presenceOfElementLocated(By.id("n")));
		String url = driver.getCurrentUrl();
		if (mode == 'b') {
			driver.findElement(By.id("b")).click();
		} else {
			driver.findElement(By.id("n")).click();
		}
		driver.findElement(By.xpath("//input[@value='Enter']")).click();
		wait.until(presenceOfElementLocated(By.id("ygtvcontentel2")));
		wait.until(presenceOfElementLocated(By.id("scorm_object")));
		System.out.println("SCO Loaded. Testing ...");
		long t0,t1;
		t0=System.currentTimeMillis();
		do {
			t1=System.currentTimeMillis();
		}
		while (t1-t0<2000);
		driver.switchTo().frame("scorm_object");
		if ((course == 1 && currentSCO != 4) || (course == 2 && currentSCO != 2)) {
			wait.until(presenceOfElementLocated(By.xpath("//*[contains(.,'This SCO Test Completed.')]")));	
		} else if ((course == 1 && currentSCO == 4) || (course == 2 && currentSCO == 2)) {
			//for both course 1 and course 2
			if (scoLeft !=0){
				wait.until(presenceOfElementLocated(By.xpath("//*[contains(.,'Please Log out and re-login to the LMS.')]")));
				return;
			} else {
				wait.until(presenceOfElementLocated(By.xpath("//*[contains(.,'This SCO Test Completed.')]")));
			}
		}
	    System.out.println(driver.findElement(By.id("teststatus")).getText());
	    currentSCO++;
	    driver.get(url);
	}

	/*	
	public void proceedToNextSCO () throws InterruptedException {
		currentSCO += 1;
		driver.switchTo().window("moodleWindow");
		//driver.findElement(By.id("ygtvlabelel"+currentSCO)).click();
		//selenium.click("ygtvlabelel"+currentSCO);
		System.out.println("Proceeding to SCO -"+currentSCO);
		wait.until(presenceOfElementLocated(By.id("ygtvlabelel3")));
		System.out.println("Testing SCO "+currentSCO+" ...");
		driver.findElement(By.id("ygtvlabelel"+(currentSCO+1))).click();
		//((JavascriptExecutor) driver).executeScript("window.location.reload();");
		//selenium.waitForPageToLoad("30000");
	}
	public  void checkSCOStatus(String line) throws InterruptedException, IOException {
		boolean status = line.contains("\"Status "+currentSCO+": SCO "+currentSCO+" Test completed\"");
		if(!status) {
			throw new IOException ("Failed at SCO: "+currentSCO);
		} else {
			//Thread thisThread = Thread.currentThread();
			//thisThread.sleep(10000);
			proceedToNextSCO();
		}
	}
	public void readSCOStatus () throws InterruptedException  {		
		System.out.println("Reading SCO "+currentSCO+" Status ..");
		//open status window the first time only
		if(currentSCO == 1) {
			//((JavascriptExecutor) driver).executeScript("window.open('"+moodleURL+"/mod/scorm/testReport.php', 'scormStatus');");
			//((JavascriptExecutor) driver).executeScript("window.open('http://www.mayank.com/moodle-6b14adf/mod/scorm/testReport.php?readStatus=1', 'scormStatus');");
		}
		//driver.switchTo().window("scormStatus");
		//wait.until(presenceOfElementLocated(By.id("SCO"+currentSCO)));
		System.out.println("Testing of SCO "+currentSCO+" completed");
		proceedToNextSCO();
		
		//Wait on initial testing for file to be created.
		/*if(currentSCO == 1) {
			Thread.sleep(10000);
		}
		String line = null;
		int currentLineNo = 0;
		int slept = 0;
		BufferedReader in = null;
		try {
			//Thread thisThread = Thread.currentThread();
			//thisThread.sleep(10000);
			in = new BufferedReader (new FileReader("C:\\xampp\\moodledata-6b14adf\\temp\\scormtesting\\scormtestStatus.txt"));
			//read till required line
			while(currentLineNo < currentSCO-1) {
				if (in.readLine() == null) {
					//thisThread.sleep(10000);
					slept = 1;
					continue;
				}
				currentLineNo++;
				slept = 0;
			}
			//read until required line
			while(currentLineNo <= (currentSCO-1)) {
				line = in.readLine();
				if (line == null && slept != 100) {
					//thisThread.sleep(10000);
					slept++;
					continue;
				}
				currentLineNo++;
				slept = 0;
				System.out.println(line);
			}
			
			checkSCOStatus(line);
		} catch (IOException ex) {
			System.out.println("Problem in status file.\n" + ex.getMessage());
		} finally {
			try { if (in!=null) in.close(); } catch(IOException ignore) {}
		}
	}*/
	public void logoutLogin(int course) {
		driver.switchTo().window("moodleWindow");
		driver.findElement(By.linkText("Logout")).click();
		loginCourse(course);
	}
	public void testCourse(int course) {
		if (course == 1) {
			while(currentSCO <= 9) {
				System.out.println("Testing SCO #"+currentSCO); 
				if(currentSCO != 4) {
					testSCO('n', 1, 0);
				} else {
					//Testing Part I of SCO #4
					testSCO('n', 1, 1);
					logoutLogin(1);
					//Testing Part II of SCO #4
					testSCO('n', 1, 1);
					//Logout IInd Time.
					logoutLogin(1);
					//SCO 4 should be completed with this.
					testSCO('n', 1, 0);

				}
			// it is not an infinite loop.
			}
		} else {
			currentSCO = 1;
			while(currentSCO <= 3) {
				System.out.println("Testing SCO #"+currentSCO);
				if(currentSCO != 2) {
					testSCO('b', 2, 0);
				} else {
					testSCO('n', 2, 1);
					logoutLogin(2);
					// SCO 2 should be completed with this.
					testSCO('n', 2, 0);
				}
			}
			currentSCO = 1;
		}
	} 
	/*public  void executeADL12Tests(int course) throws InterruptedException {
		if (course != 2) {
			testCourse1();
		} else {	
			testCourse2();
		}		
	}*/
	@Test
	public void executeADL12Tests() throws IOException {
		testSetup();
		System.out.println("Testing Course I ...");
		loginCourse(1);
		testCourse(1);
		System.out.println("Course I Test Completed. Testing Course II ...");
		logoutLogin(2);
		testCourse(2);
	}
	@After
	public void tearDown() {
		driver.close();
		//selenium.stop();
	}
	/**
	 *  Explicit Wait for element function
	 * @param locator
	 * @return
	 */
	public ExpectedCondition<WebElement> presenceOfElementLocated(final By locator) {
	    return new ExpectedCondition<WebElement>() {
	      public WebElement apply(WebDriver webDriver) {
	        return webDriver.findElement(locator);
	      }
	    };
	 }
	/**
	 *  Explicit wait for element with text
	 * @param locator
	 * @param text
	 * @return
	 */
	 public WebElement waitElementWithTextPresent(final By locator, final String text) {
	      return new WebDriverWait(driver, 30).until(new ExpectedCondition<WebElement>() {
	              @Override
	              public WebElement apply(WebDriver d) {
	                      WebElement e = d.findElement(locator);
	                      String elementText = e.getText(); 
	                      if (elementText != null && elementText.contains(text)) {
	                      	return e;
	                      } else {
	                      	return null;
	                      }
	              }
	      });
	  }
	/*public void main (String args[]) {
		testSetup(args[0], args[1]);
		testExecutor()
	}*/

}