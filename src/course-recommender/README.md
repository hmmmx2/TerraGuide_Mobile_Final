# Terraguide Mobile App 🌿

Use [Expo Router](https://docs.expo.dev/router/introduction/) with [Nativewind](https://www.nativewind.dev/v4/overview/) styling.

---

## 🚀 How to Use

Follow these steps to set up and run the Terraguide Mobile App:

1. **Set up the Development Environment** 🛠️
   - We recommend using **PyCharm** as the IDE, as the project includes Python code for AI models that require specific package installations.
   - Open the project in PyCharm.

---

2. **Install Dependencies** 📦
   - In the PyCharm terminal or a command prompt, navigate to the project root directory and run:
     ```sh
     npm install
     ```
     This installs all JavaScript dependencies for the React Native application.

---

3. **Configure the IP Address** 🌐
   - In PyCharm, right-click the project root folder and select **Replace in Files**.
   - In the search field, enter `192.168.3.153`.
   - In the replace field, enter your machine’s IP address and port (e.g., `<your-ip-address>`).
   - To find your IP address, open a command prompt and run:
     ```sh
     ipconfig
     ```

---

4. **Set up the Course Recommender Module** 📚
   - In the terminal (PyCharm terminal or command prompt), navigate to the `course-recommender` folder:
     ```sh
     cd src/course-recommender
     ```
   - Ensure you are in the `course-recommender` directory, then install Python dependencies:
     ```sh
     pip install -r requirements.txt
     ```
   - Right-click the `main.py` file in the `course-recommender` folder, select **Copy Path/Reference**, and choose **Absolute Path**.
   - Run the Python script using the copied path, for example:
     ```sh
     python.exe C:\Users\angel\WebstormProjects\Terraguide_Mobile_vA\src\course-recommender\api\main.py
     ```

---

5. **Set up the Flora Identification Module** 🌱
   - Open a new terminal (PyCharm terminal or command prompt) and navigate to the `flora-identification` folder:
     ```sh
     cd src/flora-identification
     ```
   - Install Python dependencies:
     ```sh
     pip install -r requirements.txt
     ```
   - Right-click the `main.py` file in the `flora-identification` folder, select **Copy Path/Reference**, and choose **Absolute Path**.
   - Run the Python script using the copied path, for example:
     ```sh
     python.exe C:\Users\angel\WebstormProjects\Terraguide_Mobile_vA\src\flora_identification\main.py
     ```

---

6. **Run the Mobile App with Expo Go** 📱
   - Ensure you have the **Expo Go** app installed on your phone.
   - Make sure your phone and laptop are on the same network. For best results, use your phone’s hotspot and connect your laptop to it.
   - Open a new terminal (PyCharm terminal or command prompt) to keep the `course-recommender` and `flora-identification` scripts running in their respective terminals.
   - In the new terminal, navigate to the project root directory and run:
     ```sh
     npx expo start
     ```
   - Open the Expo Go app on your phone and scan the QR code generated in the terminal to launch the app.
   - **Note**: You should now have three terminals running: one for the `course-recommender` AI, one for the `flora-identification` AI, and one for the Expo app.

---

7. **Troubleshooting Network Issues** 🔧
   - If you encounter a "Something went wrong" error, it may indicate a network mismatch between your Expo IP address and your laptop’s IP address.
   - To resolve this:
     - Run `ipconfig` in a command prompt to check your laptop’s IP address.
     - Open PowerShell as an administrator and set the correct IP address:
       ```sh
       setx /M REACT_NATIVE_PACKAGER_HOSTNAME <your-ip-address>
       ```
     - Terminate the current Expo process, close PyCharm (ensure no other programs are running in the IDE), and reopen PyCharm.
     - Run the following command to clear the cache and start Expo:
       ```sh
       npx expo start -c
       ```
     - Scan the QR code again in the Expo Go app to launch the application.

---