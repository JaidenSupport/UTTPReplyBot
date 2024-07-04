## UTTP Reply Bot
Based off [Admiral's Reply Bot](https://auttp.com/chatlogs/UTTPNETv3/knowledge-base.html)
### Prerequisites

* **[NodeJS](https://nodejs.org/)** 
* **Brand Accounts:** \
        Creating more than 5 brand accounts on a single main account could lead to your main account getting terminated. \
        1. Open YouTube and click on your profile picture. Click on "Google Account." now in the google account dashboard click on your profile picture again, your main account's email address will be displayed at the top of your profile picture. \
        2. Visit [https://www.youtube.com/channel_switcher](https://www.youtube.com/channel_switcher) and click on "Create a channel." \
        3. Name your new channel and complete the creation process. If prompted for a phone number, use another gmail. \
        4. Access YouTube Studio by clicking on your profile picture and selecting "YouTube Studio." \
        5. Ensure you are on the new brand account. If not, switch accounts by clicking on your profile picture, switch accounts then selecting the correct account. \
        6. In YouTube Studio, go to "Settings" (bottom left corner), then click on "Permissions."\
        7. Click on the "Move permissions" button. If you don't see it, ensure you created the account through youtube.com/channel_switcher. \
        8. Click "Invite" in the top right corner. Enter your main account email address and select "Manager" as the access level. \
        9. Click "Done" and then "Save." \
        10. Check your email for an invitation from YouTube to manage the new brand account. Accept the invitation.

### Running the Script

1. Download the latest release of the script from this repository and unzip the folder.
2. Open the folder twice then hold down control + L type cmd in the highlighted box then press enter.
3. Install the required dependencies by running the following commands:
    ```bash
    npm i protobufjs
    npm i axios
    ```
   **Note:** If you encounter an error stating 'npm is not recognized', ensure NodeJS is installed correctly.
4. Configure the script by running:
    ```bash
    node setup.js
    ```
    Follow the prompts to:
    * Set the desired reply text.
    * Choose whether to add random numbers to replies (recommended if you don't have a lot of brand accounts, this avoids spam filters).
    * Enter the YouTube video ID (the part after `watch?v=` in a youtube video URL).
    * Input cookies:
        * Open YouTube in your browser while logged into your **main** youtube account, click on your profile picture then switch channels if needed.
        * Open the developer tools (usually by pressing F12 or right-clicking and selecting "Inspect").
        * Go to the "Application" tab (might be under a ">>" icon).
        * Expand the "Cookies" section and select "youtube.com."
        * Search for and copy the values of these three cookies:
            * `SECURE_1PAPISID`
            * `SECURE_1PSID`
            * `SECURE_1PSIDTS` (choose the second one if you see two)
       * **Important:** These cookies expire quickly. Obtain them quickly and close your browser after copying.
    * Set the minimum and maximum delay (in milliseconds) between replies.
    * Choose whether the script should loop indefinitely.
    * Enter the channel IDs of your brand accounts:
       * Navigate to a channel's "About" page (ends with a '>').
       * Click "Share channel" and choose "Copy channel ID."
       * Paste the copied ID into the setup script.
       * Repeat for each brand account you own.
    * Type "save" to finalize the configuration.

The script will automatically fetch comment IDs from the specified video and start replying to them using your configured settings.

### Common Errors

* **Error 403:** 
    * Possible causes: incorrect or expired cookies, missing "Manager" permissions on the brand account, or an incorrect channel ID.
    * Solutions: 
        * Double-check your copied cookies and obtain fresh ones if needed.
        * Ensure your main account has "Manager" permissions for each brand account.
        * Verify the accuracy of the entered channel IDs.

If you have any issues setting up the script DM `jaidensupportalt` on discord or join our [discord server](https://discord.gg/keBHhfpCaA) and create a ticket 

todo: \
multithreading \
gui?
