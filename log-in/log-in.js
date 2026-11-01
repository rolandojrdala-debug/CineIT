// =====================================

    // API CONFIGURATION

    // =====================================



    // Local backend address for development.

    // Later, replace this with your Render backend URL.



    const API_BASE_URL = "http://127.0.0.1:3000";





    // =====================================

    // THEME TOGGLE

    // =====================================



    const themeToggle = document.getElementById("themeToggle");



    let currentTheme =

      localStorage.getItem("cineit-theme") || "dark";



    function applyTheme() {



      document.documentElement.setAttribute(

        "data-theme",

        currentTheme

      );



      themeToggle.textContent =

        currentTheme === "dark"

          ? "☀️ Light Mode"

          : "🌙 Dark Mode";



    }



    applyTheme();



    themeToggle.addEventListener("click", () => {



      currentTheme =

        currentTheme === "dark" ? "light" : "dark";



      localStorage.setItem("cineit-theme", currentTheme);



      applyTheme();



    });





    // =====================================

    // TAB SWITCHING

    // =====================================



    const tabBtns = document.querySelectorAll(".tab-btn");



    const authForms = document.querySelectorAll(".auth-form");



    const authMessage = document.getElementById("auth-message");



    tabBtns.forEach(button => {



      button.addEventListener("click", () => {



        tabBtns.forEach(btn => {

          btn.classList.remove("active");

        });



        authForms.forEach(form => {

          form.classList.remove("active");

        });



        button.classList.add("active");



        document

          .getElementById(button.dataset.target)

          .classList.add("active");



        hideAuthMessage();



      });



    });





    // =====================================

    // MESSAGE HANDLING

    // =====================================



    function showAuthMessage(message, type = "error") {



      authMessage.textContent = message;



      authMessage.className = `auth-message ${type}`;



    }



    function hideAuthMessage() {



      authMessage.textContent = "";



      authMessage.className = "auth-message";



    }





    // =====================================

    // API RESPONSE HANDLING

    // =====================================



    async function sendAuthRequest(endpoint, payload) {



      const response = await fetch(

        `${API_BASE_URL}${endpoint}`,

        {

          method: "POST",



          headers: {

            "Content-Type": "application/json"

          },



          credentials: "include",



          body: JSON.stringify(payload)

        }

      );



      const data = await response.json();



      if (!response.ok) {



        throw new Error(

          data.message || "Something went wrong."

        );



      }



      return data;



    }





    // =====================================

    // SIGN IN

    // =====================================



    document

      .getElementById("signin")

      .addEventListener("submit", async event => {



        event.preventDefault();



        hideAuthMessage();



        const email = document

          .getElementById("signin-email")

          .value

          .trim();



        const password = document

          .getElementById("signin-password")

          .value;



        const button = event.currentTarget.querySelector(

          'button[type="submit"]'

        );



        button.disabled = true;



        button.textContent = "Signing in...";



        try {



          const data = await sendAuthRequest(

            "/api/auth/login",

            {

              email,

              password

            }

          );



          showAuthMessage(

            data.message || "Welcome back to CineIT!",

            "success"

          );



          // Redirect after successful login.



          setTimeout(() => {



            window.location.href = "../index.html";



          }, 1000);



        } catch (error) {



          showAuthMessage(

            error.message === "Failed to fetch"

              ? "Cannot connect to CineIT server. Please try again later."

              : error.message

          );



        } finally {



          button.disabled = false;



          button.textContent = "Sign In →";



        }



      });





    // =====================================

    // CREATE ACCOUNT / REGISTRATION

    // =====================================



    document

      .getElementById("register")

      .addEventListener("submit", async event => {



        event.preventDefault();



        hideAuthMessage();



        const name = document

          .getElementById("reg-name")

          .value

          .trim();



        const email = document

          .getElementById("reg-email")

          .value

          .trim();



        const password = document

          .getElementById("reg-password")

          .value;



        const termsAccepted = document

          .getElementById("terms")

          .checked;



        const button = event.currentTarget.querySelector(

          'button[type="submit"]'

        );



        // Validate name.



        if (name.length < 2 || name.length > 100) {



          showAuthMessage(

            "Name must be between 2 and 100 characters."

          );



          return;



        }



        // Validate password.



        if (password.length < 12 || password.length > 128) {



          showAuthMessage(

            "Password must contain between 12 and 128 characters."

          );



          return;



        }



        // Validate terms acceptance.



        if (!termsAccepted) {



          showAuthMessage(

            "Please accept the Terms and Privacy Policy."

          );



          return;



        }



        button.disabled = true;



        button.textContent = "Creating account...";



        try {



          const data = await sendAuthRequest(

            "/api/auth/register",

            {

              name,

              email,

              password

            }

          );



          showAuthMessage(

            data.message || "Your CineIT account has been created!",

            "success"

          );



          // Redirect after successful registration.



          setTimeout(() => {



            window.location.href = "../index.html";



          }, 1000);



        } catch (error) {



          showAuthMessage(

            error.message === "Failed to fetch"

              ? "Cannot connect to CineIT server. Please try again later."

              : error.message

          );



        } finally {



          button.disabled = false;



          button.textContent = "Create Account →";



        }



      });
