    // Fetch data from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Update social links
            const platforms = ['github', 'linkedin', 'discord', 'telegram', 'twitter', 'reddit', 'gmail', 'upwork'];
            platforms.forEach(platform => {
                const linkElement = document.getElementById(`${platform}-link`);
                if (data.socialLinks[platform]) {
                    linkElement.href = data.socialLinks[platform];
                }
            });

            // Update About Me section
            const aboutMeText = document.getElementById('aboutMeText');
            if (data.aboutMe) {
                aboutMeText.textContent = data.aboutMe;
            }

            // Update Profile Picture
            const profilePicElement = document.getElementById('profilePic');
            if (data.profilePic) {
                profilePicElement.src = data.profilePic;
            }

            // Update Skills section
            const skillsGrid = document.getElementById('skillsGrid');
            data.skills.forEach(skill => {
                const skillCard = document.createElement('div');
                skillCard.className = 'skill-card';

                // CHECK: Is this an SVG string or a class name?
                let iconHtml;
                if(skill.icon.trim().startsWith('<svg')) {
                    // It's direct SVG code, use it as is
                    iconHtml = skill.icon;
                } else {
                    // It's a Boxicon class, wrap it in <i> tags
                    iconHtml = `<i class = '${skill.icon}'></i>`;
                }
                skillCard.innerHTML = `
                    <div class="icon-container">
                        ${iconHtml}
                    </div>
                    <h3>${skill.name}</h3>
                    <p>${skill.description}</p>
                `;
                skillsGrid.appendChild(skillCard);
            });

            // Update Projects section
            const projectsGrid = document.getElementById('projectsGrid');
            data.projects.forEach(project => {
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

            // Update Resume (if needed)
            if (data.resume) {
                localStorage.setItem('resume', data.resume);
            }
        })
        .catch(error => console.error('Error loading JSON data:', error));

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

    // Handle form submission
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    form.addEventListener('submit', function (e) {
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
        }).then(function () {
            form.reset();
            setTimeout(() => {
                result.style.display = 'none';
            }, 3000);
        });
    });

    // Function to download the resume
    function downloadResume() {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const resumePath = data.resume; // Get the path to the resume file
                if (resumePath) {
                    // Create a hidden link element
                    const link = document.createElement('a');
                    link.href = resumePath; // Set the path to the resume file
                    link.download = 'Vikas_Verma_Resume.pdf'; // Set the default file name for download
                    document.body.appendChild(link); // Append the link to the DOM
                    link.click(); // Trigger the download
                    document.body.removeChild(link); // Remove the link from the DOM
                } else {
                    alert('No resume found. Please upload a resume via the admin panel.');
                }
            })
            .catch(error => console.error('Error fetching resume data:', error));
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
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor behavior
            const targetId = this.getAttribute('href'); // Get the target section ID
            const targetSection = document.querySelector(targetId); // Get the target section

            if (targetSection) {
                // Calculate the offset to account for the fixed header
                const headerHeight = document.querySelector('.header').offsetHeight;
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
    document.addEventListener('DOMContentLoaded', function () {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('click', function () {
                const title = this.querySelector('.project-title').textContent;
                const description = this.querySelector('.project-description').textContent;
                const imageSrc = this.querySelector('img').src;
                const githubLink = this.querySelector('.project-github').href;

                openProjectModal(title, description, imageSrc, githubLink);
            });
        });
    });

    // Close modal when clicking outside the modal content
    window.onclick = function (event) {
        const modal = document.getElementById('projectModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
