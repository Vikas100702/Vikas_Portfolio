        // Toggle the navigation menu for small screens
        document.addEventListener('DOMContentLoaded', function () {
            const menuIcon = document.getElementById('menuIcon');
            const navLinks = document.getElementById('navLinks');

            menuIcon.addEventListener('click', function () {
                navLinks.classList.toggle('active'); // Toggle the 'active' class
            });

            // Close the menu when a link is clicked (optional)
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function () {
                    navLinks.classList.remove('active'); // Hide the menu
                });
            });
        });

    
        const form = document.getElementById('form');
        const result = document.getElementById('result');
    
        form.addEventListener('submit', function(e) {
            const formData = new FormData(form);
            e.preventDefault();
    
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
    
            result.innerHTML = 'Please wait...';
    
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            }).then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "Message Sent Successfully!";
                } else {
                    result.innerHTML = json.message;
                }
            }).catch(error => {
                console.log(error);
                result.innerHTML = 'Something went wrong!';
            }).then(function() {
                form.reset();
                setTimeout(() => {
                    result.style.display = 'none';
                }, 3000);
            });
        });
    
        // Function to download the resume
        function downloadResume() {
            const resumeData = localStorage.getItem('resume'); // Retrieve the resume from localStorage
            if (resumeData) {
                // Extract the file type (PDF or DOCX) from the Base64 data
                const fileType = resumeData.split(';')[0].split('/')[1];
                const fileName = `Vikas_Verma_Resume.${fileType}`;
    
                // Convert Base64 to a Blob
                const byteCharacters = atob(resumeData.split(',')[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: `application/${fileType}` });
    
                // Create a download link and trigger the download
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = fileName;
                link.click();
                URL.revokeObjectURL(link.href);
            } else {
                alert('No resume found. Please upload a resume via the admin panel.');
            }
        } 
    
        // Function to scroll to the top of the page
        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    
        // Function to highlight the active navigation link based on the current section
        function setActiveNavLink() {
            const sections = document.querySelectorAll('section'); // Get all sections
            const navLinks = document.querySelectorAll('.navbar a'); // Get all navigation links
    
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; // Adjust for header height
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
    
                // Check if the section is in the viewport
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active'); // Remove active class from all links
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active'); // Add active class to the current link
                        }
                    });
                }
            });
        }
    
        // Add scroll event listener to update the active class
        window.addEventListener('scroll', setActiveNavLink);
    
        // Smooth scrolling for navigation links
        document.querySelectorAll('.navbar a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent default anchor behavior
                const targetId = this.getAttribute('href'); // Get the target section ID
                const targetSection = document.querySelector(targetId); // Get the target section
    
                if (targetSection) {
                    // Calculate the offset to account for the fixed header
                    const headerHeight= document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    // Scroll to the target section smoothly
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    
        // Function to open the project modal
        function openProjectModal(title, description, imageSrc, githubLink) {
            const modal = document.getElementById('projectModal');
            const overlay = document.getElementById('overlay');
            const modalImage = document.getElementById('modalProjectImage');
            const modalTitle = document.getElementById('modalProjectTitle');
            const modalDescription = document.getElementById('modalProjectDescription');
            const modalGithubLink = document.getElementById('modalProjectGithub');
    
            // Set modal content
            modalImage.src = imageSrc;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalGithubLink.href = githubLink;
    
            // Display the modal
            modal.style.display = 'block';
            overlay.style.display = 'block'; // Show the overlay
        }
    
        // Function to close the project modal
        function closeProjectModal() {
            const modal = document.getElementById('projectModal');
            const overlay = document.getElementById('overlay');
    
            modal.style.display = 'none';
            overlay.style.display = 'none'; // Hide the overlay
        }
    
        // Add event listeners to project cards
        document.addEventListener('DOMContentLoaded', function() {
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                card.addEventListener('click', function() {
                    const title = this.querySelector('.project-title').textContent;
                    const description = this.querySelector('.project-description').textContent;
                    const imageSrc = this.querySelector('img').src;
                    const githubLink = this.querySelector('.project-github').href;
    
                    openProjectModal(title, description, imageSrc, githubLink);
                });
            });
        });
    
        // Close modal when clicking outside the modal content
        window.onclick = function(event) {
            const modal = document.getElementById('projectModal');
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        };
    
        // Retrieve links from local storage and update the portfolio page
        const platforms = ['github', 'linkedin', 'discord', 'telegram', 'twitter', 'reddit', 'gmail'];
    
        platforms.forEach(platform => {
            const linkElement = document.getElementById(`${platform}-link`);
            const savedLink = localStorage.getItem(platform);
    
            if (savedLink) {
                linkElement.href = savedLink;
            }
        });
    
        // Retrieve About Me description from local storage
        const savedDescription = localStorage.getItem('aboutMe');
        const aboutMeText = document.getElementById('aboutMeText');
    
        if (savedDescription) {
            aboutMeText.textContent = savedDescription;
        }
    
        // Retrieve skills from local storage
        const skills = JSON.parse(localStorage.getItem('skills')) || [];
        const skillsGrid = document.getElementById('skillsGrid');
    
        // Render skills
        skills.forEach(skill => {
            const skillCard = document.createElement('div');
            skillCard.className = 'skill-card';
            skillCard.innerHTML = `
                <div class="icon-container">
                    <i class='${skill.icon}'></i>
                </div>
                <h3>${skill.name}</h3>
                <p>${skill.description}</p>
            `;
            skillsGrid.appendChild(skillCard);
        });
    
        // Retrieve projects from local storage
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const projectsGrid = document.getElementById('projectsGrid');
    
        // Render projects
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.name}">
                </div>
                <div class="project-title">${project.name}</div>
            `;
    
            // Add click event to open modal
            projectCard.addEventListener('click', () => {
                openProjectModal(project.name, project.description, project.image, project.github);
            });
            projectsGrid.appendChild(projectCard);
        });

        // Load the profile picture from localStorage on page load
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Portfolio page loaded'); // Debugging line
            const savedProfilePic = localStorage.getItem('profilePic');
            const profilePicElement = document.getElementById('profilePic'); // Ensure this matches the id in the HTML

            if (savedProfilePic) {
                profilePicElement.src = savedProfilePic; // Update the src attribute
            } else {
                profilePicElement.src = 'default-profile-pic.jpg'; // Fallback to default image
            }
        });