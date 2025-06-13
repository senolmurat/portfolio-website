document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Highlight active section in navigation
    function highlightActiveSection() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
        
        // Show/hide back to top button
        if (scrollPosition > 300) {
            backToTopBtn.classList.remove('opacity-0');
            backToTopBtn.classList.add('opacity-100');
        } else {
            backToTopBtn.classList.remove('opacity-100');
            backToTopBtn.classList.add('opacity-0');
        }
    }
    
    // Mobile menu toggle
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('#mobile-menu .nav-link').forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });
    
    // Animate skill bars when skills section is viewed
    const fadeSections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                
                // Handle skill bars animation
                if (entry.target.id === 'skills') {
                    const skillBars = document.querySelectorAll('.skill-bar');
                    skillBars.forEach(bar => {
                        // Trigger animation by resetting and applying width
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                }
            }
        });
    }, { threshold: 0.15 });
    
    fadeSections.forEach(section => {
        observer.observe(section);
    });
    
    // Scroll to top
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Listen for scroll events to highlight active section
    window.addEventListener('scroll', highlightActiveSection);
    
    // Initialize highlighting on page load
    highlightActiveSection();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });

    // Fetch profile data and insert into page
    fetch('profile_data.json')
        .then(res => res.json())
        .then(data => {
            
            buildGeneralInfo(data);
            buildHomeSection(data);
            buildAboutSection(data);
            buildSkillsSection(data);
            buildServicesSection(data);
            buildWorkSection(data);
            buildProjectsSection(data);
            buildContactSection(data);
            buildFooterSection(data);

            selectedColorPalette = tailwindPalettes[data.primaryColorTheme] || defaultColorPalette; // fallback to default
            setPrimaryColor(selectedColorPalette);
            setSecondaryColor(data.secondaryColorHex || selectedColorPalette[800] || defaultSecondaryColor); 
        });

    function buildGeneralInfo(data) {
        document.querySelectorAll('.profile-endpoint').forEach(el => {
            el.textContent = data.endpoint;
        });
        document.querySelectorAll('.profile-name').forEach(el => {
            el.textContent = data.name + ' ' + (data.surname || '');
        });
        document.querySelectorAll('.profile-email').forEach(el => {
            el.textContent = data.email;
        });
        document.querySelectorAll('.profile-location').forEach(el => {
            el.textContent = data.location;
        });
        document.querySelectorAll('.profile-address').forEach(el => {
            el.textContent = data.address;
        });
        document.querySelectorAll('.profile-phone').forEach(el => {
            el.textContent = data.phone;
        });
        document.querySelectorAll('.profile-languages').forEach(el => {
            el.textContent = Array.isArray(data.languages) ? data.languages.join(', ') : data.languages;
        });
        document.querySelectorAll('.profile-degree').forEach(el => {
            el.textContent = data.degree;
        });
        document.querySelectorAll('.profile-title').forEach(el => {
            el.textContent = data.title;
        });
        document.querySelectorAll('.profile-years').forEach(el => {
            el.textContent = data.yearsOfExperience;
        });
        if (data.social) {
            Object.entries(data.social).forEach(([name, url]) => {
                document.querySelectorAll('.profile-' + name).forEach(el => {
                    el.classList.add('social-link');
                    if (url && url.trim() !== '') {
                        el.href = url;
                        el.hidden = false;
                        el.style.display = '';
                    } else {
                        el.hidden = true;
                        el.style.display = 'none';
                    }
                });
            });
        }
        // Set page title
        if (data.name && data.title) {
            document.title = `${data.name}${data.surname ? ' ' + data.surname : ''} | ${data.title}`;
        }
    }

    function buildHomeSection(data) {
        if (data.home) {
            const homeDesc = document.getElementById('home-description');
            if (homeDesc) {
                homeDesc.innerHTML = '';
                homeDesc.textContent = data.home.description || '';
            }
            const homeBtn = document.querySelector('#home a.border');
            if (homeBtn) {
                homeBtn.textContent = data.home.buttonText || 'Download CV';
                if (data.home.buttonLink) {
                    homeBtn.href = data.home.buttonLink;
                    homeBtn.setAttribute('target', '_blank');
                }
            }
        }
        // Set profile image from JSON (prefer data.image, fallback to data.home.image)
        const profileImageContainer = document.querySelectorAll('#profile-image img');
        if (profileImageContainer.length > 0) {
            const imgUrl = data.image || (data.home && data.home.image);
            if (imgUrl) {
                profileImageContainer.forEach(img => {
                    img.src = imgUrl;
                });
                profileImageContainer.alt = data.name ? data.name + (data.surname ? ' ' + data.surname : '') : 'Profile photo';
            }
        }
        
        // Arrange profile-image and home-text based on imagePosition
        const homeInfo = document.getElementById('home-info');
        const profileImage = document.getElementById('profile-image');
        const homeText = document.getElementById('home-text');
        const homeDesc = document.getElementById('home-description');
        if (homeInfo && profileImage && homeText) {
            // Remove layout classes that may interfere
            homeInfo.classList.remove('flex-row', 'md:flex-row', 'flex-col', 'text-center');
            profileImage.classList.remove('order-1', 'order-2', 'md:order-1', 'md:order-2', 'md:w-1/2', 'w-full');
            homeText.classList.remove('order-1', 'order-2', 'md:order-1', 'md:order-2', 'md:w-1/2', 'w-full');
            const homeButtons = document.getElementById('home-buttons');
            if (homeButtons) {
                homeButtons.classList.remove('justify-center', 'mx-auto', 'justify-end', 'ml-auto');
                homeButtons.style.textAlign = '';
            }
            if (homeDesc) {
                homeDesc.classList.remove('w-full', 'md:w-1/2', 'justify-center', 'mx-auto');
            }
            if (data.imagePosition === 'left') {
                homeInfo.classList.add('flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'w-full');
                profileImage.classList.add('md:w-1/2');
                homeText.classList.add('md:w-1/2');
                if (homeInfo.firstChild !== profileImage) {
                    homeInfo.insertBefore(profileImage, homeText);
                }
            } else if (data.imagePosition === 'middle') {
                homeInfo.classList.add('flex', 'flex-col', 'items-center', 'w-full', 'text-center');
                profileImage.classList.add('w-full');
                homeText.classList.add('w-full');
                homeInfo.appendChild(profileImage);
                homeInfo.appendChild(homeText);
                if (homeButtons) {
                    homeButtons.classList.remove('justify-center', 'mx-auto');
                    homeButtons.classList.add('justify-end', 'ml-auto');
                    homeButtons.style.textAlign = 'right';
                }
                if (homeDesc) {
                    homeDesc.classList.add('w-full', 'md:w-1/2', 'justify-center', 'mx-auto');
                }
            } else {
                // Default: right
                homeInfo.classList.add('flex', 'flex-col', 'md:flex-row', 'items-center', 'justify-between', 'w-full');
                profileImage.classList.add('md:w-1/2');
                homeText.classList.add('md:w-1/2');
                if (homeInfo.lastChild !== profileImage) {
                    homeInfo.appendChild(profileImage);
                }
            }
        }
        // Synchronize bounce animations
        syncHomeAnimations();
    }

    function syncHomeAnimations() {
        const homeIcon = document.getElementById('home-icon');
        const scrollIndicator = document.querySelector('a[href="#about"].animate-bounce');
        if (homeIcon && scrollIndicator) {
            homeIcon.classList.remove('animate-bounce');
            scrollIndicator.classList.remove('animate-bounce');
            // Force reflow
            void homeIcon.offsetWidth;
            void scrollIndicator.offsetWidth;
            // Add back in sync
            homeIcon.classList.add('animate-bounce');
            scrollIndicator.classList.add('animate-bounce');
        }
    }

    function buildAboutSection(data) {
        if (data.about) {
            const aboutSubtitle = document.querySelector('#about .text-center p');
            if (aboutSubtitle) aboutSubtitle.textContent = data.about.subtitle || '';
            const aboutDesc = document.querySelector('#about .md\\:w-2\\/3.fade-in-section p.text-gray-600');
            if (aboutDesc) aboutDesc.textContent = data.about.description || '';
        }
    }

    function buildSkillsSection(data) {
        if (data.skills) {
            const skillsSubtitle = document.querySelector('#skills .text-center p');
            if (skillsSubtitle) skillsSubtitle.textContent = data.skills.subtitle || '';
            const techSkills = data.skills.technicalSkills || [];
            const techSkillsContainer = document.querySelector('#skills .fade-in-section:nth-of-type(1) .grid');
            if (techSkillsContainer) {
                techSkillsContainer.innerHTML = techSkills.map(skill =>
                    `<span class=\"inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-2\">${skill}</span>`
                ).join('');
            }
            const profSkills = data.skills.professionalSkills || [];
            const profSkillsContainer = document.querySelector('#skills .fade-in-section:nth-of-type(2) .grid');
            if (profSkillsContainer) {
                profSkillsContainer.innerHTML = profSkills.map(skill =>
                    `<span class=\"inline-block bg-primary/10 text-primary font-medium rounded-full px-4 py-2\">${skill}</span>`
                ).join('');
            }
            const tools = data.skills.tools || [];
            const toolsGrid = document.getElementById('tools-grid');
            if (toolsGrid) {
                const toolCount = tools.length;
                toolsGrid.className = `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-${toolCount > 6 ? 6 : toolCount} max-w-${toolCount > 6 ? '4' : (toolCount <= 6 && toolCount > 4) ? toolCount - 2 : ''}xl gap-6 mx-auto`;
                toolsGrid.innerHTML = tools.map(tool =>
                    `<div class=\"bg-white p-4 rounded-xl shadow-sm flex flex-col items-center card-hover\">
                        <img src=\"${tool.icon}\" alt=\"${tool.name}\" class=\"w-12 h-12 mb-2\">
                        <span class=\"font-medium\">${tool.name}</span>
                    </div>`
                ).join('');
            }
        }
    }

    function buildServicesSection(data) {
        if (data.services && Array.isArray(data.services.services)) {
            const services = data.services.services;
            const servicesGrid = document.getElementById('services-grid');
            const servicesSection = document.getElementById('services-section');
            if (servicesSection && servicesGrid) {
                if (data.services.hidden) {
                    servicesSection.style.display = 'none';
                    return;
                }
                servicesSection.style.display = '';
                const serviceCount = services.length;
                servicesGrid.className = `grid gap-8 grid-cols-1 md:grid-cols-${serviceCount > 3 ? 3 : serviceCount} mx-auto`;
                if (serviceCount === 1) {
                    servicesGrid.classList.add('max-w-xl');
                } else if (serviceCount === 2) {
                    servicesGrid.classList.add('max-w-4xl');
                }
                servicesGrid.innerHTML = services.map(service =>
                    `<div class=\"bg-gray-50 p-8 rounded-xl shadow-sm card-hover flex flex-col h-full\">
                        <div>
                            <div class=\"text-primary text-4xl mb-6 w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center\">
                                <i class=\"${service.image || ''}\"></i>
                            </div>
                            <h4 class=\"font-bold text-xl mb-3\">${service.title}</h4>
                            <p class=\"text-gray-600 mb-4 flex-grow\">${service.description}</p>
                        </div>
                        <div hidden class=\"mt-auto\">
                            <a href=\"${service.detailLink || '#'}\" class=\"text-primary font-medium inline-flex items-center mt-2\">
                                Learn More <i class=\"fas fa-arrow-right ml-2 text-sm\"></i>
                            </a>
                        </div>
                    </div>`
                ).join('');
            }
        }
    }

    function buildWorkSection(data) {
        if (data.work) {
            const experienceSection = document.getElementById('experience');
            if (experienceSection && data.work.hidden) {
                experienceSection.style.display = 'none';
                return;
            }
            experienceSection.style.display = '';
            const careerTimeline = document.getElementById('career-timeline');
            if (careerTimeline && Array.isArray(data.work.career)) {
                careerTimeline.innerHTML = data.work.career.map(item => `
                    <div class=\"mb-10 timeline-item\">
                        <div class=\"bg-gray-50 p-6 rounded-xl shadow-sm\">
                            <div class=\"flex justify-between items-start mb-3\">
                                <h4 class=\"font-bold text-lg\">${item.title}</h4>
                                <span class=\"bg-blue-100 text-primary text-xs font-medium px-2.5 py-0.5 rounded\">${item.dateStart} - ${item.dateEnd}</span>
                            </div>
                            <h5 class=\"font-medium text-primary mb-2\">${item.company}</h5>
                            ${item.description ? `<p class=\"text-gray-600 mb-4\">${item.description}</p>` : ''}
                            <div class=\"flex flex-wrap gap-2\">
                                ${(item.skills || []).map(skill => `<span class=\"bg-blue-50 text-primary text-xs px-2 py-1 rounded\">${skill}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');
            }
            const educationTimeline = document.getElementById('education-timeline');
            if (educationTimeline && Array.isArray(data.work.education)) {
                educationTimeline.innerHTML = data.work.education.map(item => `
                    <div class=\"mb-10 timeline-item education\">
                        <div class=\"bg-gray-50 p-6 rounded-xl shadow-sm\">
                            <div class=\"flex justify-between items-start mb-3\">
                                <h4 class=\"font-bold text-lg\">${item.title}</h4>
                                <span class=\"bg-blue-100 text-primary text-xs font-medium px-2.5 py-0.5 rounded\">${item.dateStart} - ${item.dateEnd}</span>
                            </div>
                            <h5 class=\"font-medium text-primary mb-2\">${item.institution}</h5>
                            ${item.description ? `<p class=\"text-gray-600 mb-4\">${item.description}</p>` : ''}
                        </div>
                    </div>
                `).join('');
                const certificates = data.work.certificates;
                let certificatesGrid = document.getElementById('certificates-grid');
                if (certificates && certificates.length > 0) {
                    if (!certificatesGrid) {
                        certificatesGrid = document.createElement('div');
                        certificatesGrid.id = 'certificates-grid';
                        certificatesGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
                        educationTimeline.appendChild(certificatesGrid);
                    }
                    certificatesGrid.innerHTML = certificates.map(item => `
                        <div class=\"certificate\">
                            <div class=\"bg-gray-50 p-6 rounded-xl shadow-sm\">
                                <div class=\"flex justify-between items-start mb-3\">
                                    <h5 class=\"font-bold text-lg \">${item.institution}</h5>
                                    <span class=\"bg-blue-100 text-primary text-xs font-medium px-2.5 py-0.5 rounded\">${item.date || ''}</span>
                                </div>
                                <div class=\"flex justify-between items-start mb-3\">
                                    <h4 class=\"font-medium text-primary mb-2 underline\">
                                        ${item.link ? `<a href=\"${item.link}\" target=\"_blank\">${item.title}</a>` : ''}
                                        </h4>
                                </div>
                                
                                ${item.description ? `<p class=\"text-gray-600 mb-1\">${item.description}</p>` : ''}
                            </div>
                        </div>
                    `).join('');
                } else if (certificatesGrid) {
                    certificatesGrid.innerHTML = '';
                }
            }
        }
    }

    function buildProjectsSection(data) {
        const projectsSection = document.getElementById('projects');
        if (projectsSection && data.projects && data.projects.hidden) {
            projectsSection.style.display = 'none';
            return;
        }
        if (projectsSection && data.projects) {
            projectsSection.style.display = '';
            const projectsSubtitle = projectsSection.querySelector('.text-center p');
            if (projectsSubtitle) projectsSubtitle.textContent = data.projects.subtitle || '';
            let projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid && Array.isArray(data.projects.projects)) {
                projectsGrid.innerHTML = data.projects.projects.map(project => `
                    <div class=\"bg-white rounded-xl overflow-hidden shadow-sm card-hover fade-in-section flex flex-col h-full\">
                        <div class=\"h-48 bg-gradient-to-r from-primary to-secondary flex items-center justify-center\">
                            ${project.imageUrl ? `<img src='${project.imageUrl}' alt='${project.title}' class='w-full h-full object-cover'>` : `<i class='fas fa-project-diagram text-white text-6xl'></i>`}
                        </div>
                        <div class=\"p-6 flex flex-col h-full\">
                            <div class=\"flex justify-between items-start mb-4\">
                                <h4 class=\"font-bold text-lg\">${project.title}</h4>
                                <div class=\"flex space-x-2\">
                                    ${project.link ? `<a href='${project.link}' class='text-gray-500 hover:text-primary' target='_blank' title='External Link'><i class='fas fa-external-link-alt'></i></a>` : ''}
                                </div>
                            </div>
                            ${project.description ? `<p class='text-gray-600 mb-4'>${project.description}</p>` : ''}
                            <div class=\"mt-auto flex flex-wrap gap-2\">
                                ${(project.skills || []).map(skill => `<span class='bg-blue-50 text-primary text-xs px-2 py-1 rounded'>${skill}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');
                // Re-observe new fade-in-section elements
                document.querySelectorAll('#projects-grid .fade-in-section').forEach(section => {
                    observer.observe(section);
                });
            }
        }
    }

    function buildContactSection(data) {
        if (data.contact) {
            // Set contact form action to email from JSON
            const contactForm = document.getElementById('contact-form');
            if (contactForm && data.email) {
                //contactForm.action = `https://formsubmit.co/${data.email}`;
                contactForm.action = `https://formsubmit.co/517fdcfbfb38b9a38463070c0e921984`;
            }
            // Set _next input to redirect to this page with formSuccess=true
            let nextInput = contactForm.querySelector('input[name="_next"]');
            
            const url = new URL(window.location.href);
            console.log(url);
            url.searchParams.set('formSuccess', 'true');
            nextInput.value = url.origin + url.pathname + url.search;
            // Newsletter
            const newsletter = document.getElementById('newsletter');
            newsletter.style.display = (newsletter && data.contact.newsletterHidden) ? 'none' : '';
            // Subtitle
            const contactSubtitle = document.querySelector('#contact .text-center p');
            if (contactSubtitle) contactSubtitle.textContent = data.contact.subtitle || '';
        }
    }
    
    function buildFooterSection(data) {
        if (data.footer) {
            // Footer description
            const footerDesc = document.querySelector('#footer p.text-gray-400');
            if (footerDesc) footerDesc.textContent = data.footer.description || '';
        }
    }

    // SVG markup for a person icon
    function setDynamicFavicon(primaryColor) {
        const svg = `
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='${primaryColor}'>
            <circle cx='16' cy='12' r='6'/>
            <rect x='8' y='20' width='16' height='8' rx='4'/>
          </svg>
        `;
        const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svg);
        let favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            document.head.appendChild(favicon);
        }
        favicon.type = 'image/svg+xml';
        favicon.href = svgDataUrl;
    }

    // Color setter functions
    function setPrimaryColor(palette) {
        document.documentElement.style.setProperty('--tw-color-primary', palette[500]);
        if (window.tailwind && window.tailwind.config) {
            tailwind.config.theme.extend.colors.primary = palette[500];
        }
        // Update bg-blue-50/100/200 and text-blue-50/100/200 to use the selected palette
        [
            { cls: 'bg-blue-50',   val: palette[50] },
            { cls: 'bg-blue-100',  val: palette[100] },
            { cls: 'bg-blue-200',  val: palette[200] },
            { cls: 'text-blue-50', val: palette[50] },
            { cls: 'text-blue-100',val: palette[100] },
            { cls: 'text-blue-200',val: palette[200] }
        ].forEach(({cls, val}) => {
            document.querySelectorAll('.' + cls).forEach(el => {
                if (cls.startsWith('bg-')) el.style.backgroundColor = val;
                else el.style.color = val;
            });
        });
        setDynamicFavicon(palette[500]);
    }

    function setSecondaryColor(hex) {
        if (window.tailwind && window.tailwind.config) {
            tailwind.config.theme.extend.colors.secondary = hex;
        }
        //document.querySelectorAll('.to-secondary').style.setProperty('--tw-color-secondary', hex);
    }

    document.getElementById('contact-form').addEventListener('submit', function(e) {
        // Let Formsubmit handle the actual submission, but show a success message after redirect
        setTimeout(function() {
            document.getElementById('form-success').classList.remove('hidden');
        }, 1000);
    });

    // Show form success toast if URL contains formSuccess=true
    if (window.location.search.includes('formSuccess=true')) {
        var formSuccess = document.getElementById('form-success');
        if (formSuccess) {
            formSuccess.classList.remove('hidden');
        }
    }
});