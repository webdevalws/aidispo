// AI-DISPO Admin Portal Controller Script
document.addEventListener("DOMContentLoaded", () => {
  // State
  let currentUser = null;
  let authToken = null;

  // Blog State
  let blogs = [];
  let currentEditingBlogId = null;
  let currentPage = 1;
  let entriesPerPage = 10;
  let searchQuery = "";
  let sortField = "created_at";
  let sortAsc = false;
  let blogEditorInstance = null;

  // Jobs State
  let jobs = [];
  let currentEditingJobId = null;
  let jobEditorInstance = null;
  let jobStatusFilter = "ALL";
  let searchJobQuery = "";

  // Applicants State
  let applicants = [];
  let applicantJobFilter = "ALL";
  let searchApplicantQuery = "";

  // Queries State (Contact Us Procurement Inquiries)
  let queries = [];
  let currentViewingQueryId = null;
  let queryStatusFilter = "ALL";
  let queryProductFilter = "ALL";
  let searchQueryVal = "";
  let queryCurrentPage = 1;
  let queryEntriesPerPage = 10;

  // DOM Elements - Login & Global
  const loginOverlay = document.getElementById("loginOverlay");
  const loginForm = document.getElementById("loginForm");
  const loginAlert = document.getElementById("loginAlert");
  const adminLayout = document.getElementById("adminLayout");
  const adminEmailInput = document.getElementById("adminEmail");
  const adminPassInput = document.getElementById("adminPassword");
  const adminUserNameEl = document.getElementById("adminUserName");
  const adminUserRoleEl = document.getElementById("adminUserRole");
  const btnLogout = document.getElementById("btnLogout");
  const btnTopLogout = document.getElementById("btnTopLogout");
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  const adminSidebar = document.getElementById("adminSidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const toastContainer = document.getElementById("toastContainer");

  // Nav Items
  const menuItemBlog = document.getElementById("menuItemBlog");
  const menuItemQuery = document.getElementById("menuItemQuery");
  const menuItemJobs = document.getElementById("menuItemJobs");
  const menuItemPostJob = document.getElementById("menuItemPostJob");
  const menuItemApplicants = document.getElementById("menuItemApplicants");
  const navBlog = document.getElementById("navBlog");
  const navQuery = document.getElementById("navQuery");
  const navJobs = document.getElementById("navJobs");
  const navPostJob = document.getElementById("navPostJob");
  const navApplicants = document.getElementById("navApplicants");
  const applicantsCountBadge = document.getElementById("applicantsCountBadge");
  const queryCountBadge = document.getElementById("queryCountBadge");

  // Views
  const viewBlogList = document.getElementById("viewBlogList");
  const viewPostBlog = document.getElementById("viewPostBlog");
  const viewJobList = document.getElementById("viewJobList");
  const viewPostJob = document.getElementById("viewPostJob");
  const viewApplicants = document.getElementById("viewApplicants");
  const viewQueries = document.getElementById("viewQueries");

  // Query Elements
  const queryStatusFilterEl = document.getElementById("queryStatusFilter");
  const queryProductFilterEl = document.getElementById("queryProductFilter");
  const searchQueryInputEl = document.getElementById("searchQueryInput");
  const btnExportQueries = document.getElementById("btnExportQueries");
  const queryTableBody = document.getElementById("queryTableBody");
  const queryPaginationInfo = document.getElementById("queryPaginationInfo");
  const queryPaginationButtons = document.getElementById("queryPaginationButtons");
  const queryDetailsModal = document.getElementById("queryDetailsModal");
  const btnCloseQueryModal = document.getElementById("btnCloseQueryModal");
  const btnCloseQueryModalBtn = document.getElementById("btnCloseQueryModalBtn");
  const queryModalName = document.getElementById("queryModalName");
  const queryModalOrg = document.getElementById("queryModalOrg");
  const queryModalEmail = document.getElementById("queryModalEmail");
  const queryModalPhone = document.getElementById("queryModalPhone");
  const queryModalProduct = document.getElementById("queryModalProduct");
  const queryModalVolume = document.getElementById("queryModalVolume");
  const queryModalSku = document.getElementById("queryModalSku");
  const queryModalSkuRow = document.getElementById("queryModalSkuRow");
  const queryModalMessage = document.getElementById("queryModalMessage");
  const queryModalStatusBadge = document.getElementById("queryModalStatusBadge");
  const queryModalDate = document.getElementById("queryModalDate");
  const queryModalStatusSelect = document.getElementById("queryModalStatusSelect");
  const queryModalMailtoBtn = document.getElementById("queryModalMailtoBtn");


  // Blog Elements
  const btnAddNewBlog = document.getElementById("btnAddNewBlog");
  const btnCancelPost = document.getElementById("btnCancelPost");
  const postFormTitle = document.getElementById("postFormTitle");
  const btnSubmitBlog = document.getElementById("btnSubmitBlog");
  const blogTableBody = document.getElementById("blogTableBody");
  const searchInput = document.getElementById("searchInput");
  const entriesSelect = document.getElementById("entriesSelect");
  const paginationInfo = document.getElementById("paginationInfo");
  const paginationButtons = document.getElementById("paginationButtons");
  const blogForm = document.getElementById("blogForm");
  const blogMetaTitle = document.getElementById("blogMetaTitle");
  const blogMetaDesc = document.getElementById("blogMetaDesc");
  const blogTitle = document.getElementById("blogTitle");
  const blogSlug = document.getElementById("blogSlug");
  const blogCategoryBadge = document.getElementById("blogCategoryBadge");
  const categoryBadgePreview = document.getElementById("categoryBadgePreview");
  const btnInsertBadgeToEditor = document.getElementById("btnInsertBadgeToEditor");
  const blogTags = document.getElementById("blogTags");
  const blogImageFile = document.getElementById("blogImageFile");
  const blogImageUrl = document.getElementById("blogImageUrl");
  const imgPreview = document.getElementById("imgPreview");
  const imgPlaceholder = document.getElementById("imgPlaceholder");

  // Job Elements
  const btnAddNewJob = document.getElementById("btnAddNewJob");
  const btnCancelJob = document.getElementById("btnCancelJob");
  const jobFormTitle = document.getElementById("jobFormTitle");
  const btnSubmitJob = document.getElementById("btnSubmitJob");
  const jobForm = document.getElementById("jobForm");
  const jobTitle = document.getElementById("jobTitle");
  const jobDepartment = document.getElementById("jobDepartment");
  const jobLocation = document.getElementById("jobLocation");
  const jobType = document.getElementById("jobType");
  const jobExperience = document.getElementById("jobExperience");
  const jobStatus = document.getElementById("jobStatus");
  const jobRequirements = document.getElementById("jobRequirements");
  const jobTableBody = document.getElementById("jobTableBody");
  const jobStatusFilterEl = document.getElementById("jobStatusFilter");
  const searchJobInput = document.getElementById("searchJobInput");

  // Applicant Elements
  const applicantTableBody = document.getElementById("applicantTableBody");
  const applicantJobFilterEl = document.getElementById("applicantJobFilter");
  const searchApplicantInput = document.getElementById("searchApplicantInput");
  const applicantDetailsModal = document.getElementById("applicantDetailsModal");
  const btnCloseAppModal = document.getElementById("btnCloseAppModal");
  const appModalName = document.getElementById("appModalName");
  const appModalJob = document.getElementById("appModalJob");
  const appModalEmail = document.getElementById("appModalEmail");
  const appModalPhone = document.getElementById("appModalPhone");
  const appModalExp = document.getElementById("appModalExp");
  const appModalResumeLink = document.getElementById("appModalResumeLink");
  const appModalResumeRow = document.getElementById("appModalResumeRow");
  const appModalBio = document.getElementById("appModalBio");

  // ==================== 1. CKEDITOR INITIALIZATION ====================
  if (window.CKEDITOR) {
    CKEDITOR.config.versionCheck = false;
  }

  function initCKEditors() {
    if (!window.CKEDITOR) return;

    if (!blogEditorInstance && document.getElementById("blogEditor")) {
      blogEditorInstance = CKEDITOR.replace("blogEditor", {
        versionCheck: false,
        height: 360,
        toolbar: [
          { name: "document", items: ["Source"] },
          { name: "clipboard", items: ["Cut", "Copy", "Paste", "PasteText", "Undo", "Redo"] },
          { name: "basicstyles", items: ["Bold", "Italic", "Underline", "Strike", "Subscript", "Superscript", "-", "RemoveFormat"] },
          { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent", "-", "Blockquote", "-", "JustifyLeft", "JustifyCenter", "JustifyRight"] },
          { name: "links", items: ["Link", "Unlink"] },
          { name: "insert", items: ["Image", "Table", "HorizontalRule", "SpecialChar"] },
          { name: "styles", items: ["Format", "Font", "FontSize"] },
          { name: "colors", items: ["TextColor", "BGColor"] },
          { name: "tools", items: ["Maximize"] }
        ],
        removePlugins: "exportpdf"
      });
    }

    if (!jobEditorInstance && document.getElementById("jobEditor")) {
      jobEditorInstance = CKEDITOR.replace("jobEditor", {
        versionCheck: false,
        height: 260,
        toolbar: [
          { name: "clipboard", items: ["Undo", "Redo"] },
          { name: "basicstyles", items: ["Bold", "Italic", "Underline", "-", "RemoveFormat"] },
          { name: "paragraph", items: ["NumberedList", "BulletedList", "-", "Outdent", "Indent"] },
          { name: "links", items: ["Link", "Unlink"] },
          { name: "insert", items: ["Table", "HorizontalRule"] },
          { name: "styles", items: ["Format"] }
        ],
        removePlugins: "exportpdf"
      });
    }
  }

  // Live Category Badge preview
  if (blogCategoryBadge && categoryBadgePreview) {
    blogCategoryBadge.addEventListener("input", () => {
      const val = blogCategoryBadge.value.trim();
      categoryBadgePreview.textContent = val ? val.toUpperCase() : "IV CANNULA";
    });
  }

  if (btnInsertBadgeToEditor) {
    btnInsertBadgeToEditor.addEventListener("click", () => {
      const badgeText = (blogCategoryBadge && blogCategoryBadge.value.trim()) ? blogCategoryBadge.value.trim().toUpperCase() : "IV CANNULA";
      const badgeHtml = `<span class="article-category-badge" style="display:inline-flex; align-items:center; justify-content:center; font-family:sans-serif; font-size:11px; font-weight:800; letter-spacing:0.05em; text-transform:uppercase; color:#013572; background:#ffffff; border:1.5px solid #00a8ff; box-shadow:2px 2px 0px #00a8ff; padding:4px 12px; border-radius:6px; margin: 4px 6px;">${badgeText}</span>&nbsp;`;
      
      if (blogEditorInstance) {
        blogEditorInstance.insertHtml(badgeHtml);
        showToast(`Inserted [ ${badgeText} ] badge card into editor!`, "success");
      }
    });
  }

  // ==================== 2. AUTHENTICATION & NAVIGATION ====================
  function checkAuth() {
    const savedToken = localStorage.getItem("aidispo_admin_token");
    const savedUser = localStorage.getItem("aidispo_admin_user");

    if (savedToken && savedUser) {
      try {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        showDashboard();
        return;
      } catch (e) {}
    }
    showLogin();
  }

  const btnTogglePassword = document.getElementById("btnTogglePassword");

  function showLogin() {
    loginOverlay.style.display = "flex";
    adminLayout.style.display = "none";
    if (adminEmailInput) adminEmailInput.value = "";
    if (adminPassInput) {
      adminPassInput.value = "";
      adminPassInput.setAttribute("type", "password");
    }
    if (btnTogglePassword) {
      const eyeShow = btnTogglePassword.querySelector(".eye-show");
      const eyeHide = btnTogglePassword.querySelector(".eye-hide");
      if (eyeShow) eyeShow.style.display = "block";
      if (eyeHide) eyeHide.style.display = "none";
      btnTogglePassword.setAttribute("title", "Show password");
    }
    if (loginAlert) loginAlert.style.display = "none";
  }

  // Toggle Password Visibility (Eye icon)
  if (btnTogglePassword && adminPassInput) {
    btnTogglePassword.addEventListener("click", () => {
      const isPassword = adminPassInput.getAttribute("type") === "password";
      adminPassInput.setAttribute("type", isPassword ? "text" : "password");

      const eyeShow = btnTogglePassword.querySelector(".eye-show");
      const eyeHide = btnTogglePassword.querySelector(".eye-hide");

      if (eyeShow && eyeHide) {
        eyeShow.style.display = isPassword ? "none" : "block";
        eyeHide.style.display = isPassword ? "block" : "none";
      }

      btnTogglePassword.setAttribute("aria-label", isPassword ? "Hide password" : "Show password");
      btnTogglePassword.setAttribute("title", isPassword ? "Hide password" : "Show password");
    });
  }


  function showDashboard() {
    loginOverlay.style.display = "none";
    adminLayout.style.display = "flex";
    if (currentUser) {
      adminUserNameEl.textContent = currentUser.email || "aidispo@admin.com";
      adminUserRoleEl.textContent = currentUser.role || "Administrator";
    }
    initCKEditors();
    loadBlogs();
    loadQueries();
    loadJobs();
    loadApplicants();
  }

  // Login Form Submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginAlert.style.display = "none";

    const email = adminEmailInput.value.trim();
    const password = adminPassInput.value.trim();
    const submitBtn = loginForm.querySelector(".btn-login");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Authenticating...";
    submitBtn.disabled = true;

    try {
      let loginSuccess = false;
      let userObj = null;
      let token = null;

      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            loginSuccess = true;
            token = data.token;
            userObj = data.user;
          }
        }
      } catch (networkErr) {}

      if (!loginSuccess) {
        if (email.toLowerCase() === "aidispo@admin.com" && password === "aiadmin") {
          loginSuccess = true;
          token = btoa(JSON.stringify({ email, role: "Administrator", exp: Date.now() + 86400000 * 7 }));
          userObj = { email: "aidispo@admin.com", name: "AI-DISPO Admin", role: "Administrator" };
        }
      }

      if (loginSuccess) {
        authToken = token;
        currentUser = userObj;
        localStorage.setItem("aidispo_admin_token", token);
        localStorage.setItem("aidispo_admin_user", JSON.stringify(userObj));
        showToast("Welcome back, Administrator!", "success");
        showDashboard();
      } else {
        loginAlert.textContent = "Wrong credentials. Please verify your Email and Password.";
        loginAlert.className = "login-alert error";
        loginAlert.style.display = "flex";
      }
    } catch (err) {
      loginAlert.textContent = "Authentication error: " + err.message;
      loginAlert.className = "login-alert error";
      loginAlert.style.display = "flex";
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });

  // Logout Handler
  function handleLogout() {
    localStorage.removeItem("aidispo_admin_token");
    localStorage.removeItem("aidispo_admin_user");
    authToken = null;
    currentUser = null;
    showToast("Logged out successfully.", "info");
    showLogin();
  }

  if (btnLogout) btnLogout.addEventListener("click", handleLogout);
  if (btnTopLogout) btnTopLogout.addEventListener("click", handleLogout);

  // Sidebar Toggle
  if (btnToggleSidebar) {
    btnToggleSidebar.addEventListener("click", () => {
      adminSidebar.classList.toggle("open");
      sidebarBackdrop.classList.toggle("active");
    });
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => {
      adminSidebar.classList.remove("open");
      sidebarBackdrop.classList.remove("active");
    });
  }

  // Switch Active View
  function switchView(viewName) {
    [viewBlogList, viewPostBlog, viewJobList, viewPostJob, viewApplicants, viewQueries].forEach(v => {
      if (v) v.classList.remove("active");
    });
    [menuItemBlog, menuItemQuery, menuItemJobs, menuItemPostJob, menuItemApplicants].forEach(m => {
      if (m) m.classList.remove("active");
    });

    if (viewName === "blog-list") {
      if (viewBlogList) viewBlogList.classList.add("active");
      if (menuItemBlog) menuItemBlog.classList.add("active");
      renderBlogTable();
    } else if (viewName === "blog-post") {
      if (viewPostBlog) viewPostBlog.classList.add("active");
      if (menuItemBlog) menuItemBlog.classList.add("active");
    } else if (viewName === "queries") {
      if (viewQueries) viewQueries.classList.add("active");
      if (menuItemQuery) menuItemQuery.classList.add("active");
      renderQueryTable();
    } else if (viewName === "job-list") {
      if (viewJobList) viewJobList.classList.add("active");
      if (menuItemJobs) menuItemJobs.classList.add("active");
      renderJobTable();
    } else if (viewName === "job-post") {
      if (viewPostJob) viewPostJob.classList.add("active");
      if (menuItemPostJob) menuItemPostJob.classList.add("active");
    } else if (viewName === "applicants") {
      if (viewApplicants) viewApplicants.classList.add("active");
      if (menuItemApplicants) menuItemApplicants.classList.add("active");
      renderApplicantTable();
    }

    if (window.innerWidth <= 900) {
      if (adminSidebar) adminSidebar.classList.remove("open");
      if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
    }
  }
  window.switchView = switchView;

  // Nav menu listeners
  if (navBlog) navBlog.addEventListener("click", (e) => { e.preventDefault(); switchView("blog-list"); });
  if (menuItemBlog) menuItemBlog.addEventListener("click", (e) => { if (e.target.tagName !== 'A') switchView("blog-list"); });

  if (navQuery) navQuery.addEventListener("click", (e) => { e.preventDefault(); switchView("queries"); });
  if (menuItemQuery) menuItemQuery.addEventListener("click", (e) => { if (e.target.tagName !== 'A') switchView("queries"); });

  if (navJobs) navJobs.addEventListener("click", (e) => { e.preventDefault(); switchView("job-list"); });
  if (menuItemJobs) menuItemJobs.addEventListener("click", (e) => { if (e.target.tagName !== 'A') switchView("job-list"); });

  if (navPostJob) navPostJob.addEventListener("click", (e) => { 
    e.preventDefault(); 
    resetJobForm(); 
    jobFormTitle.textContent = "Post Job"; 
    btnSubmitJob.textContent = "Publish Job"; 
    currentEditingJobId = null; 
    switchView("job-post"); 
  });
  if (menuItemPostJob) menuItemPostJob.addEventListener("click", (e) => { 
    if (e.target.tagName !== 'A') {
      resetJobForm(); 
      jobFormTitle.textContent = "Post Job"; 
      btnSubmitJob.textContent = "Publish Job"; 
      currentEditingJobId = null; 
      switchView("job-post"); 
    }
  });

  if (navApplicants) navApplicants.addEventListener("click", (e) => { e.preventDefault(); switchView("applicants"); });
  if (menuItemApplicants) menuItemApplicants.addEventListener("click", (e) => { if (e.target.tagName !== 'A') switchView("applicants"); });



  btnAddNewBlog.addEventListener("click", () => {
    resetBlogForm();
    postFormTitle.textContent = "Post Blog";
    btnSubmitBlog.textContent = "Publish";
    currentEditingBlogId = null;
    switchView("blog-post");
  });

  btnCancelPost.addEventListener("click", () => {
    resetBlogForm();
    switchView("blog-list");
  });

  btnAddNewJob.addEventListener("click", () => {
    resetJobForm();
    jobFormTitle.textContent = "Post Job";
    btnSubmitJob.textContent = "Publish Job";
    currentEditingJobId = null;
    switchView("job-post");
  });

  btnCancelJob.addEventListener("click", () => {
    resetJobForm();
    switchView("job-list");
  });

  // ==================== 3. BLOG MANAGEMENT ====================
  blogTitle.addEventListener("input", () => {
    if (!currentEditingBlogId) {
      blogSlug.value = blogTitle.value.toLowerCase().trim().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
    }
  });

  blogImageFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        blogImageUrl.value = base64;
        imgPreview.src = base64;
        imgPreview.style.display = "block";
        imgPlaceholder.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });

  async function loadBlogs() {
    try {
      let fetched = false;
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data.blogs && Array.isArray(data.blogs)) {
            blogs = data.blogs;
            fetched = true;
          }
        }
      } catch (err) {}

      if (!fetched) {
        const local = localStorage.getItem("aidispo_blogs_db");
        if (local) {
          blogs = JSON.parse(local);
        } else {
          blogs = [
            {
              id: 1,
              title: "Zero Dead Space Syringes: Eliminating Medication Waste in Oncology & Vaccines",
              meta_title: "Zero Dead Space Syringes - Clinical Waste Reduction",
              meta_description: "How ultra-low dead space plunger tips recover up to 10% additional dosage per vial.",
              slug: "zero-dead-space-syringes-eliminating-medication-waste",
              badge_tag: "SYRINGES",
              content: "<p>Ultra-low dead space syringe engineering eliminates residual dead volume in needle hubs.</p>",
              tags: "Syringes, Fluidics, Oncology",
              image_url: "../assets/prod_syringe.jpg",
              views: 668,
              likes: 0,
              created_at: "2026-09-15 10:55:54"
            },
            {
              id: 2,
              title: "FEP vs. Polyurethane Catheters: Clinical Impact on Thrombophlebitis & Dwell Time",
              meta_title: "FEP vs Polyurethane IV Catheters Comparison",
              meta_description: "Comparing thermo-softening polyurethane and FEP catheters in prolonged access.",
              slug: "fep-vs-polyurethane-catheters-clinical-impact",
              badge_tag: "IV CANNULA",
              content: "<p>Vascular access safety relies heavily on biomaterial selection.</p>",
              tags: "IV Cannula, Vascular Access",
              image_url: "../assets/prod_iv_cannula.jpg",
              views: 410,
              likes: 0,
              created_at: "2026-09-16 13:17:20"
            }
          ];
          saveLocalBlogs();
        }
      }
      renderBlogTable();
    } catch (e) {
      console.error(e);
    }
  }

  function saveLocalBlogs() {
    localStorage.setItem("aidispo_blogs_db", JSON.stringify(blogs));
  }

  function renderBlogTable() {
    let filtered = blogs.filter(b => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (b.title && b.title.toLowerCase().includes(q)) || (b.tags && b.tags.toLowerCase().includes(q));
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / entriesPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    const startIdx = (currentPage - 1) * entriesPerPage;
    const endIdx = Math.min(startIdx + entriesPerPage, total);
    const pageItems = filtered.slice(startIdx, endIdx);

    if (pageItems.length === 0) {
      blogTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #94a3b8;">No blogs found.</td></tr>`;
    } else {
      blogTableBody.innerHTML = pageItems.map((blog, idx) => {
        const serialNo = startIdx + idx + 1;
        const date = blog.created_at ? blog.created_at.substring(0, 19).replace("T", " ") : "2026-10-02";
        return `
          <tr data-id="${blog.id}">
            <td class="col-sno">${serialNo}</td>
            <td class="col-title"><a href="../blog-post.html?id=${blog.id}" target="_blank" style="color: inherit; text-decoration: none; font-weight: 600;">${escapeHtml(blog.title)}</a></td>
            <td class="col-views">${blog.views || 0}</td>
            <td class="col-likes">${blog.likes || 0}</td>
            <td class="col-date">${date}</td>
            <td class="col-action">
              <button class="action-btn edit" title="Edit Blog" onclick="window.editBlog(${blog.id})">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              </button>
              <button class="action-btn delete" title="Delete Blog" onclick="window.deleteBlog(${blog.id})">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </td>
          </tr>
        `;
      }).join("");
    }

    paginationInfo.textContent = `Showing ${total > 0 ? startIdx + 1 : 0} to ${endIdx} of ${total} entries`;
    let pagHtml = `<button class="page-btn" ${currentPage === 1 ? "disabled" : ""} onclick="window.changePage(${currentPage - 1})">Previous</button>`;
    for (let p = 1; p <= totalPages; p++) {
      pagHtml += `<button class="page-btn ${p === currentPage ? "active" : ""}" onclick="window.changePage(${p})">${p}</button>`;
    }
    pagHtml += `<button class="page-btn ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""} onclick="window.changePage(${currentPage + 1})">Next</button>`;
    paginationButtons.innerHTML = pagHtml;
  }

  window.changePage = (page) => { currentPage = page; renderBlogTable(); };

  window.editBlog = (id) => {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    currentEditingBlogId = id;
    postFormTitle.textContent = "Edit Blog";
    btnSubmitBlog.textContent = "Update Blog";

    blogMetaTitle.value = blog.meta_title || "";
    blogMetaDesc.value = blog.meta_description || "";
    blogTitle.value = blog.title || "";
    blogSlug.value = blog.slug || "";
    
    const badgeVal = blog.badge_tag || (blog.tags ? blog.tags.split(',')[0].trim() : 'IV CANNULA');
    blogCategoryBadge.value = badgeVal;
    categoryBadgePreview.textContent = badgeVal.toUpperCase();

    blogTags.value = blog.tags || "";
    blogImageUrl.value = blog.image_url || "";

    if (blog.image_url) {
      imgPreview.src = blog.image_url;
      imgPreview.style.display = "block";
      imgPlaceholder.style.display = "none";
    } else {
      imgPreview.style.display = "none";
      imgPlaceholder.style.display = "block";
    }

    if (blogEditorInstance) {
      blogEditorInstance.setData(blog.content || "");
    }
    switchView("blog-post");
  };

  window.deleteBlog = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    if (authToken) {
      try {
        await fetch(`/api/blogs/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${authToken}` } });
      } catch (e) {}
    }
    blogs = blogs.filter(b => b.id !== id);
    saveLocalBlogs();
    showToast("Blog deleted", "success");
    renderBlogTable();
  };

  function resetBlogForm() {
    blogForm.reset();
    blogCategoryBadge.value = "IV CANNULA";
    categoryBadgePreview.textContent = "IV CANNULA";
    blogImageUrl.value = "";
    imgPreview.src = "";
    imgPreview.style.display = "none";
    imgPlaceholder.style.display = "block";
    if (blogEditorInstance) blogEditorInstance.setData("");
  }

  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = sanitizePlainText(blogTitle.value, 250);
    const meta_title = sanitizePlainText(blogMetaTitle.value || title, 250);
    const meta_description = sanitizePlainText(blogMetaDesc.value, 500);
    let slug = sanitizePlainText(blogSlug.value, 150) || title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
    const badge_tag = sanitizePlainText(blogCategoryBadge.value.toUpperCase() || "IV CANNULA", 50);
    const tags = sanitizePlainText(blogTags.value || badge_tag, 500);
    const rawImg = blogImageUrl.value.trim() || "../assets/prod_syringe.jpg";
    const image_url = sanitizeSafeUrl(rawImg) || "../assets/prod_syringe.jpg";
    const rawContent = blogEditorInstance ? blogEditorInstance.getData() : "";
    const content = sanitizeRichHtml(rawContent);

    if (!title || !content) {
      showToast("Title and Content are required", "error");
      return;
    }

    const payload = { title, meta_title, meta_description, slug, badge_tag, content, tags, image_url, author: "AI-DISPO Clinical Team" };
    btnSubmitBlog.disabled = true;

    try {
      if (authToken) {
        try {
          const endpoint = currentEditingBlogId ? `/api/blogs/${currentEditingBlogId}` : "/api/blogs";
          await fetch(endpoint, {
            method: currentEditingBlogId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify(payload)
          });
        } catch (e) {}
      }

      if (currentEditingBlogId) {
        const idx = blogs.findIndex(b => b.id === currentEditingBlogId);
        if (idx !== -1) blogs[idx] = { ...blogs[idx], ...payload, updated_at: new Date().toISOString() };
        showToast("Blog updated!", "success");
      } else {
        blogs.unshift({ id: Date.now(), ...payload, views: 0, likes: 0, created_at: new Date().toISOString() });
        showToast("Blog published!", "success");
      }

      saveLocalBlogs();
      resetBlogForm();
      switchView("blog-list");
      renderBlogTable();
    } catch (err) {
      showToast("Error saving blog: " + err.message, "error");
    } finally {
      btnSubmitBlog.disabled = false;
    }
  });

  searchInput.addEventListener("input", (e) => { searchQuery = e.target.value; currentPage = 1; renderBlogTable(); });
  entriesSelect.addEventListener("change", (e) => { entriesPerPage = parseInt(e.target.value, 10); currentPage = 1; renderBlogTable(); });

  // ==================== 4. JOB / CAREERS MANAGEMENT ====================
  async function loadJobs() {
    try {
      let fetched = false;
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          if (data.jobs && Array.isArray(data.jobs)) {
            jobs = data.jobs;
            fetched = true;
          }
        }
      } catch (e) {}

      if (!fetched) {
        const local = localStorage.getItem("aidispo_jobs_db");
        if (local) {
          jobs = JSON.parse(local);
        } else {
          jobs = [
            {
              id: 1,
              title: "Quality Assurance (QA) Clinical Specialist",
              department: "Quality Assurance",
              location: "Facility HQ, India",
              job_type: "Full-Time",
              experience: "2-4 Years",
              description: "<p>Oversee ISO 13485:2016 compliance, bioburden validation, and batch release testing in our cleanroom facility.</p>",
              requirements: "Degree in Biotechnology/Pharmacy with cleanroom QA experience.",
              status: "Active"
            },
            {
              id: 2,
              title: "Precision Plastic Injection Moulding Engineer",
              department: "Engineering",
              location: "Cleanroom Plant, India",
              job_type: "Full-Time",
              experience: "3-6 Years",
              description: "<p>Lead tooling, multi-cavity hot-runner moulding parameter optimization for UltraFlow syringe barrels and cannula hubs.</p>",
              requirements: "B.Tech/Diploma in Plastics Engineering or Mechanical.",
              status: "Active"
            },
            {
              id: 3,
              title: "Regulatory Affairs & CE Compliance Executive",
              department: "Regulatory",
              location: "Corporate Office, India",
              job_type: "Full-Time",
              experience: "2-5 Years",
              description: "<p>Prepare and maintain CDSCO MDR 2017 & EU-MDR Technical Files, sterile barrier validation, and ISO audit documentation.</p>",
              requirements: "Experience with MDR 2017 Class IIa medical device dossiers.",
              status: "Active"
            }
          ];
          saveLocalJobs();
        }
      }
      renderJobTable();
      populateApplicantJobFilter();
    } catch (e) {
      console.error(e);
    }
  }

  function saveLocalJobs() {
    localStorage.setItem("aidispo_jobs_db", JSON.stringify(jobs));
  }

  function renderJobTable() {
    let filtered = jobs.filter(j => {
      const matchStatus = (jobStatusFilter === "ALL") || (j.status === jobStatusFilter);
      const matchSearch = !searchJobQuery || (j.title && j.title.toLowerCase().includes(searchJobQuery.toLowerCase())) || (j.department && j.department.toLowerCase().includes(searchJobQuery.toLowerCase()));
      return matchStatus && matchSearch;
    });

    if (filtered.length === 0) {
      jobTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">No jobs found. Click 'Post New Job' to add one.</td></tr>`;
      return;
    }

    jobTableBody.innerHTML = filtered.map((job, idx) => {
      const count = applicants.filter(a => String(a.job_id) === String(job.id)).length;
      const rawStatus = job.status || "Active";
      const statusClass = escapeHtml(rawStatus.toLowerCase().replace(/\s+/g, ''));
      const safeId = Number(job.id) || 0;
      return `
        <tr>
          <td class="col-sno">${idx + 1}</td>
          <td style="font-weight: 600;">
            <a href="../careers.html" target="_blank" style="color: inherit; text-decoration: none;">${escapeHtml(job.title)}</a>
          </td>
          <td><span class="job-badge">${escapeHtml(job.department || 'General')}</span></td>
          <td style="color: #64748b; font-size: 12.5px;">${escapeHtml(job.location || 'HQ, India')}</td>
          <td><span class="job-badge type">${escapeHtml(job.job_type || 'Full-Time')}</span></td>
          <td style="text-align: center;">
            <button class="filter-pill" style="padding: 3px 10px; font-size: 11px;" onclick="window.filterApplicantsByJob(${safeId})">
              👥 ${count} Applicants
            </button>
          </td>
          <td style="text-align: center;">
            <span class="status-badge ${statusClass}">${escapeHtml(rawStatus)}</span>
          </td>
          <td class="col-action">
            <button class="action-btn edit" title="Edit Job" onclick="window.editJob(${safeId})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="action-btn delete" title="Delete Job" onclick="window.deleteJob(${safeId})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  window.editJob = (id) => {
    const job = jobs.find(j => j.id === id);
    if (!job) return;

    currentEditingJobId = id;
    jobFormTitle.textContent = "Edit Job";
    btnSubmitJob.textContent = "Update Job";

    jobTitle.value = job.title || "";
    jobDepartment.value = job.department || "Quality Assurance";
    jobLocation.value = job.location || "Facility HQ, India";
    jobType.value = job.job_type || "Full-Time";
    jobExperience.value = job.experience || "2-5 Years";
    jobStatus.value = job.status || "Active";
    jobRequirements.value = job.requirements || "";

    if (jobEditorInstance) {
      jobEditorInstance.setData(job.description || "");
    }

    switchView("job-post");
  };

  window.deleteJob = async (id) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    if (authToken) {
      try {
        await fetch(`/api/jobs/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${authToken}` } });
      } catch (e) {}
    }
    jobs = jobs.filter(j => j.id !== id);
    saveLocalJobs();
    showToast("Job posting deleted", "success");
    renderJobTable();
  };

  function resetJobForm() {
    jobForm.reset();
    jobDepartment.value = "Quality Assurance";
    jobLocation.value = "Facility HQ, India";
    jobType.value = "Full-Time";
    jobExperience.value = "2-5 Years";
    jobStatus.value = "Active";
    if (jobEditorInstance) jobEditorInstance.setData("");
  }

  jobForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = sanitizePlainText(jobTitle.value, 200);
    const department = sanitizePlainText(jobDepartment.value, 100);
    const location = sanitizePlainText(jobLocation.value || "Facility HQ, India", 150);
    const job_type = sanitizePlainText(jobType.value || "Full-Time", 80);
    const experience = sanitizePlainText(jobExperience.value || "2-5 Years", 80);
    const status = sanitizePlainText(jobStatus.value || "Active", 50);
    const requirements = sanitizePlainText(jobRequirements.value, 2000);
    const rawDesc = jobEditorInstance ? jobEditorInstance.getData() : "";
    const description = sanitizeRichHtml(rawDesc);

    if (!title || !description) {
      showToast("Job title and description are required", "error");
      return;
    }

    const payload = { title, department, location, job_type, experience, status, requirements, description };
    btnSubmitJob.disabled = true;

    try {
      if (authToken) {
        try {
          const endpoint = currentEditingJobId ? `/api/jobs/${currentEditingJobId}` : "/api/jobs";
          await fetch(endpoint, {
            method: currentEditingJobId ? "PUT" : "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify(payload)
          });
        } catch (e) {}
      }

      if (currentEditingJobId) {
        const idx = jobs.findIndex(j => j.id === currentEditingJobId);
        if (idx !== -1) jobs[idx] = { ...jobs[idx], ...payload, updated_at: new Date().toISOString() };
        showToast("Job updated successfully!", "success");
      } else {
        jobs.unshift({ id: Date.now(), ...payload, created_at: new Date().toISOString() });
        showToast("Job posted successfully!", "success");
      }

      saveLocalJobs();
      resetJobForm();
      switchView("job-list");
      renderJobTable();
      populateApplicantJobFilter();
    } catch (err) {
      showToast("Error saving job: " + err.message, "error");
    } finally {
      btnSubmitJob.disabled = false;
    }
  });

  jobStatusFilterEl.addEventListener("change", (e) => { jobStatusFilter = e.target.value; renderJobTable(); });
  searchJobInput.addEventListener("input", (e) => { searchJobQuery = e.target.value; renderJobTable(); });

  // ==================== 5. APPLICANTS MANAGEMENT ====================
  async function loadApplicants() {
    try {
      let fetched = false;
      try {
        if (authToken) {
          const res = await fetch("/api/applicants", { headers: { "Authorization": `Bearer ${authToken}` } });
          if (res.ok) {
            const data = await res.json();
            if (data.applicants && Array.isArray(data.applicants)) {
              applicants = data.applicants;
              fetched = true;
            }
          }
        }
      } catch (e) {}

      if (!fetched) {
        const local = localStorage.getItem("aidispo_applicants_db");
        if (local) {
          applicants = JSON.parse(local);
        } else {
          applicants = [
            {
              id: 101,
              job_id: 1,
              job_title: "Quality Assurance (QA) Clinical Specialist",
              full_name: "Pooja Deshmukh",
              email: "pooja.deshmukh@gmail.com",
              phone: "+91 98234 56789",
              experience: "3.5 Years",
              resume_url: "https://linkedin.com/in/poojadeshmukh-qa",
              cover_letter: "Having 3+ years managing Class 100k cleanroom QA audits, bioburden testing and ISO 13485:2016 SOPs.",
              status: "Shortlisted",
              applied_at: "2026-09-28 14:22:10"
            },
            {
              id: 102,
              job_id: 2,
              job_title: "Precision Plastic Injection Moulding Engineer",
              full_name: "Amit Kumar Verma",
              email: "amit.verma.eng@gmail.com",
              phone: "+91 91234 11223",
              experience: "5 Years",
              resume_url: "https://drive.google.com/sample_resume",
              cover_letter: "Experienced in Demag/Engel moulding machines with 64-cavity precision syringe barrel tooling.",
              status: "Pending",
              applied_at: "2026-10-01 11:15:30"
            }
          ];
          saveLocalApplicants();
        }
      }

      if (applicantsCountBadge) applicantsCountBadge.textContent = applicants.length;
      renderApplicantTable();
    } catch (e) {
      console.error(e);
    }
  }

  function saveLocalApplicants() {
    localStorage.setItem("aidispo_applicants_db", JSON.stringify(applicants));
    if (applicantsCountBadge) applicantsCountBadge.textContent = applicants.length;
  }

  function populateApplicantJobFilter() {
    if (!applicantJobFilterEl) return;
    applicantJobFilterEl.innerHTML = `<option value="ALL">All Jobs (${applicants.length})</option>` +
      jobs.map(j => `<option value="${j.id}">${escapeHtml(j.title)}</option>`).join("");
  }

  function renderApplicantTable() {
    let filtered = applicants.filter(a => {
      const matchJob = (applicantJobFilter === "ALL") || (String(a.job_id) === String(applicantJobFilter));
      const matchSearch = !searchApplicantQuery || 
        (a.full_name && a.full_name.toLowerCase().includes(searchApplicantQuery.toLowerCase())) ||
        (a.email && a.email.toLowerCase().includes(searchApplicantQuery.toLowerCase())) ||
        (a.job_title && a.job_title.toLowerCase().includes(searchApplicantQuery.toLowerCase()));
      return matchJob && matchSearch;
    });

    if (filtered.length === 0) {
      applicantTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">No applicants found matching filter.</td></tr>`;
      return;
    }

    applicantTableBody.innerHTML = filtered.map((app, idx) => {
      const date = app.applied_at ? escapeHtml(app.applied_at.substring(0, 10)) : "2026-10-02";
      const safeEmail = encodeURIComponent(app.email || "");
      const safePhone = encodeURIComponent(app.phone || "");
      return `
        <tr>
          <td class="col-sno">${idx + 1}</td>
          <td style="font-weight: 700; color: #013572;">
            <a href="javascript:void(0)" onclick="window.viewApplicantDetails(${Number(app.id)})" style="color: inherit; text-decoration: underline;">
              ${escapeHtml(app.full_name)}
            </a>
          </td>
          <td><span class="job-badge">${escapeHtml(app.job_title || 'General')}</span></td>
          <td style="font-size: 12.5px;">
            <div>📧 <a href="mailto:${safeEmail}" style="color: #2563eb;">${escapeHtml(app.email)}</a></div>
            <div style="color: #64748b;">📞 ${escapeHtml(app.phone || 'N/A')}</div>
          </td>
          <td style="font-size: 12.5px; color: #475569;">${escapeHtml(app.experience || 'N/A')}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; color: #64748b;">${date}</td>
          <td style="text-align: center;">
            <select class="status-select" onchange="window.updateApplicantStatus(${Number(app.id)}, this.value)">
              <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>⭐ Shortlisted</option>
              <option value="Interviewed" ${app.status === 'Interviewed' ? 'selected' : ''}>🗣️ Interviewed</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>❌ Rejected</option>
            </select>
          </td>
          <td class="col-action">
            <button class="action-btn edit" title="View Candidate Application" onclick="window.viewApplicantDetails(${Number(app.id)})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="action-btn delete" title="Delete Applicant" onclick="window.deleteApplicant(${Number(app.id)})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("");
  }

  window.filterApplicantsByJob = (jobId) => {
    applicantJobFilter = String(jobId);
    if (applicantJobFilterEl) applicantJobFilterEl.value = String(jobId);
    switchView("applicants");
    renderApplicantTable();
  };

  window.updateApplicantStatus = async (id, newStatus) => {
    const app = applicants.find(a => a.id === id);
    if (app) {
      app.status = newStatus;
      saveLocalApplicants();
      if (authToken) {
        try {
          await fetch(`/api/applicants/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify({ status: newStatus })
          });
        } catch (e) {}
      }
      showToast(`Status updated to ${newStatus}`, "info");
    }
  };

  window.viewApplicantDetails = (id) => {
    const app = applicants.find(a => a.id === id);
    if (!app) return;

    appModalName.textContent = app.full_name || "Applicant";
    appModalJob.textContent = `Position Applied: ${app.job_title || 'General'}`;
    
    appModalEmail.textContent = app.email || "";
    appModalEmail.href = `mailto:${encodeURIComponent(app.email || '')}`;
    
    appModalPhone.textContent = app.phone || "";
    appModalPhone.href = `tel:${encodeURIComponent(app.phone || '')}`;
    
    appModalExp.textContent = app.experience || "Not specified";
    
    if (app.resume_url && /^https?:\/\//i.test(app.resume_url)) {
      appModalResumeRow.style.display = "block";
      appModalResumeLink.href = app.resume_url;
    } else {
      appModalResumeRow.style.display = "none";
    }

    appModalBio.textContent = app.cover_letter || "No additional bio or cover notes provided.";
    applicantDetailsModal.style.display = "flex";
  };


  window.deleteApplicant = async (id) => {
    if (!confirm("Are you sure you want to remove this applicant?")) return;
    if (authToken) {
      try {
        await fetch(`/api/applicants/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${authToken}` } });
      } catch (e) {}
    }
    applicants = applicants.filter(a => a.id !== id);
    saveLocalApplicants();
    showToast("Applicant removed", "success");
    renderApplicantTable();
    renderJobTable();
  };

  if (btnCloseAppModal) {
    btnCloseAppModal.addEventListener("click", () => {
      applicantDetailsModal.style.display = "none";
    });
  }
  if (applicantDetailsModal) {
    applicantDetailsModal.addEventListener("click", (e) => {
      if (e.target === applicantDetailsModal) {
        applicantDetailsModal.style.display = "none";
      }
    });
  }

  applicantJobFilterEl.addEventListener("change", (e) => { applicantJobFilter = e.target.value; renderApplicantTable(); });
  searchApplicantInput.addEventListener("input", (e) => { searchApplicantQuery = e.target.value; renderApplicantTable(); });

  // ==================== 6. QUERIES (CONTACT US INQUIRIES) MANAGEMENT ====================
  const defaultSampleQueries = [
    {
      id: 101,
      name: "Dr. Rajeshwar Sharma",
      organization: "Apollo Specialty Hospitals Network",
      email: "procurement@apollohospitals.org",
      phone: "+91 98210 44521",
      product: "Syringe",
      volume: "50k-200k",
      sku: "AD-5ML-LL-N21G-15-STERILE",
      message: "Requesting comprehensive batch quote for 100,000 units of 5mL Luer Lock Syringes with 21G needles for quarterly ICU and Emergency supplies. Please provide delivery timeline to Chennai Central Medical Store.",
      status: "New",
      created_at: "2026-10-02T14:30:00.000Z"
    },
    {
      id: 102,
      name: "Marcus Vance",
      organization: "MedGlobal Distribution FZCO (Dubai)",
      email: "m.vance@medglobal.ae",
      phone: "+971 50 892 1144",
      product: "IV-Cannula",
      volume: "Container-Load",
      sku: "CAN-20G-PTFE-WINGED",
      message: "Looking for FCL export quotation of 20G and 22G Winged with Port IV Cannulas with CE marking for GCC territory distribution.",
      status: "In Progress",
      created_at: "2026-10-01T09:15:00.000Z"
    },
    {
      id: 103,
      name: "Pooja Deshmukh",
      organization: "Sahyadri Diagnostics & Research Center",
      email: "pooja.d@sahyadridiag.com",
      phone: "+91 94231 77650",
      product: "Needle",
      volume: "Evaluation-Samples",
      sku: "NDL-23G-1INCH-BEVEL",
      message: "Please dispatch sample pack of 23G & 24G hypodermic needles for our lab phlebotomy trial.",
      status: "Contacted",
      created_at: "2026-09-29T11:40:00.000Z"
    }
  ];

  async function loadQueries() {
    try {
      let apiQueries = [];
      if (authToken) {
        try {
          const res = await fetch("/api/queries", {
            headers: { "Authorization": `Bearer ${authToken}` }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.queries) {
              apiQueries = data.queries;
            }
          }
        } catch (netErr) {}
      }

      const storedLocal = localStorage.getItem("aidispo_queries");
      if (apiQueries.length > 0) {
        queries = apiQueries;
        saveLocalQueries();
      } else if (storedLocal) {
        queries = JSON.parse(storedLocal);
      } else {
        queries = defaultSampleQueries;
        saveLocalQueries();
      }

      renderQueryTable();
    } catch (e) {
      console.error(e);
    }
  }

  function saveLocalQueries() {
    localStorage.setItem("aidispo_queries", JSON.stringify(queries));
    updateQueryBadge();
  }

  function updateQueryBadge() {
    if (!queryCountBadge) return;
    const newCount = queries.filter(q => q.status === "New" || !q.status).length;
    queryCountBadge.textContent = newCount;
    queryCountBadge.title = `${newCount} unread / new procurement queries`;
  }

  function renderQueryTable() {
    let filtered = queries.filter(q => {
      const matchStatus = (queryStatusFilter === "ALL") || (q.status === queryStatusFilter);
      const matchProduct = (queryProductFilter === "ALL") || (q.product && q.product.toLowerCase() === queryProductFilter.toLowerCase());
      const search = searchQueryVal.toLowerCase();
      const matchSearch = !searchQueryVal || 
        (q.name && q.name.toLowerCase().includes(search)) ||
        (q.organization && q.organization.toLowerCase().includes(search)) ||
        (q.email && q.email.toLowerCase().includes(search)) ||
        (q.phone && q.phone.toLowerCase().includes(search)) ||
        (q.sku && q.sku.toLowerCase().includes(search)) ||
        (q.message && q.message.toLowerCase().includes(search));
      return matchStatus && matchProduct && matchSearch;
    });

    // Pagination
    const totalEntries = filtered.length;
    const totalPages = Math.ceil(totalEntries / queryEntriesPerPage) || 1;
    if (queryCurrentPage > totalPages) queryCurrentPage = totalPages;
    const startIdx = (queryCurrentPage - 1) * queryEntriesPerPage;
    const paginated = filtered.slice(startIdx, startIdx + queryEntriesPerPage);

    if (queryPaginationInfo) {
      if (totalEntries === 0) {
        queryPaginationInfo.textContent = "Showing 0 entries";
      } else {
        const endIdx = Math.min(startIdx + queryEntriesPerPage, totalEntries);
        queryPaginationInfo.textContent = `Showing ${startIdx + 1} to ${endIdx} of ${totalEntries} queries`;
      }
    }

    renderQueryPaginationButtons(totalPages);

    if (paginated.length === 0) {
      queryTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">No procurement queries found matching criteria.</td></tr>`;
      return;
    }

    queryTableBody.innerHTML = paginated.map((q, idx) => {
      const sNo = startIdx + idx + 1;
      const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent";
      const safeEmail = encodeURIComponent(q.email || "");
      const safePhone = encodeURIComponent(q.phone || "");

      return `
        <tr>
          <td class="col-sno">${sNo}</td>
          <td>
            <div style="font-weight: 700; color: #013572;">
              <a href="javascript:void(0)" onclick="window.viewQueryDetails(${Number(q.id)})" style="color: inherit; text-decoration: underline;">
                ${escapeHtml(q.name)}
              </a>
            </div>
            ${q.organization ? `<div style="font-size: 12px; color: #64748b; margin-top: 2px;">🏢 ${escapeHtml(q.organization)}</div>` : ''}
          </td>
          <td style="font-size: 12.5px;">
            <div>📧 <a href="mailto:${safeEmail}" style="color: #2563eb; font-weight: 500;">${escapeHtml(q.email)}</a></div>
            <div style="color: #475569; margin-top: 2px;">📞 <a href="tel:${safePhone}" style="color: inherit; text-decoration: none;">${escapeHtml(q.phone)}</a></div>
          </td>
          <td style="font-size: 12.5px;">
            <div><span class="job-badge" style="background: #e0f2fe; color: #0369a1; border-color: #bae6fd;">${escapeHtml(q.product || 'Syringe')}</span></div>
            <div style="font-size: 11px; color: #64748b; margin-top: 3px;">📦 ${escapeHtml(q.volume || 'Standard MOQ')}</div>
          </td>
          <td>
            ${q.sku ? `<code style="font-size: 11px; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #0f172a;">${escapeHtml(q.sku)}</code>` : '<span style="color: #94a3b8; font-size: 12px;">—</span>'}
          </td>
          <td style="font-family: var(--font-mono); font-size: 12px; color: #64748b; white-space: nowrap;">${escapeHtml(dateStr)}</td>
          <td style="text-align: center;">
            <select class="status-select" onchange="window.updateQueryStatus(${Number(q.id)}, this.value)" style="font-weight: 600;">
              <option value="New" ${q.status === 'New' || !q.status ? 'selected' : ''}>🔵 New</option>
              <option value="In Progress" ${q.status === 'In Progress' ? 'selected' : ''}>🟡 In Progress</option>
              <option value="Contacted" ${q.status === 'Contacted' ? 'selected' : ''}>🟣 Contacted</option>
              <option value="Resolved" ${q.status === 'Resolved' ? 'selected' : ''}>🟢 Resolved</option>
            </select>
          </td>
          <td class="col-action">
            <button class="action-btn edit" title="View Full Query Details" onclick="window.viewQueryDetails(${Number(q.id)})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="action-btn delete" title="Delete Query" onclick="window.deleteQuery(${Number(q.id)})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </td>
        </tr>
      `;
    }).join("");

  }

  function renderQueryPaginationButtons(totalPages) {
    if (!queryPaginationButtons) return;
    queryPaginationButtons.innerHTML = "";
    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.className = "page-btn";
    prevBtn.innerHTML = "‹";
    prevBtn.disabled = queryCurrentPage === 1;
    prevBtn.addEventListener("click", () => {
      if (queryCurrentPage > 1) {
        queryCurrentPage--;
        renderQueryTable();
      }
    });
    queryPaginationButtons.appendChild(prevBtn);

    for (let p = 1; p <= totalPages; p++) {
      const pageBtn = document.createElement("button");
      pageBtn.className = `page-btn ${p === queryCurrentPage ? "active" : ""}`;
      pageBtn.textContent = p;
      pageBtn.addEventListener("click", () => {
        queryCurrentPage = p;
        renderQueryTable();
      });
      queryPaginationButtons.appendChild(pageBtn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "page-btn";
    nextBtn.innerHTML = "›";
    nextBtn.disabled = queryCurrentPage === totalPages;
    nextBtn.addEventListener("click", () => {
      if (queryCurrentPage < totalPages) {
        queryCurrentPage++;
        renderQueryTable();
      }
    });
    queryPaginationButtons.appendChild(nextBtn);
  }

  window.viewQueryDetails = (id) => {
    const q = queries.find(item => item.id === id);
    if (!q) return;
    currentViewingQueryId = id;

    queryModalName.textContent = q.name;
    queryModalOrg.textContent = q.organization ? `🏢 ${q.organization}` : "Individual Clinical Buyer";
    queryModalEmail.textContent = q.email;
    queryModalEmail.href = `mailto:${q.email}?subject=Response to AI-DISPO Procurement Inquiry (Ref #${q.id})&body=Dear ${encodeURIComponent(q.name)},%0D%0A%0D%0AThank you for reaching out to Goel Allied Industries regarding AI-DISPO products.`;
    
    queryModalPhone.textContent = q.phone;
    queryModalPhone.href = `tel:${q.phone}`;

    queryModalProduct.textContent = q.product || "Syringe";
    queryModalVolume.textContent = q.volume || "Standard MOQ";

    if (q.sku) {
      queryModalSkuRow.style.display = "block";
      queryModalSku.textContent = q.sku;
    } else {
      queryModalSkuRow.style.display = "none";
    }

    queryModalMessage.textContent = q.message || "No specific requirement message provided.";

    const statusVal = q.status || "New";
    queryModalStatusBadge.className = `status-badge ${statusVal.toLowerCase().replace(/\s+/g, "")}`;
    queryModalStatusBadge.textContent = statusVal;

    const dateStr = q.created_at ? new Date(q.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "Recent";
    queryModalDate.textContent = `Received: ${dateStr}`;

    if (queryModalStatusSelect) {
      queryModalStatusSelect.value = statusVal;
      queryModalStatusSelect.onchange = (e) => {
        window.updateQueryStatus(q.id, e.target.value);
        queryModalStatusBadge.className = `status-badge ${e.target.value.toLowerCase().replace(/\s+/g, "")}`;
        queryModalStatusBadge.textContent = e.target.value;
      };
    }

    if (queryModalMailtoBtn) {
      queryModalMailtoBtn.href = `mailto:${q.email}?subject=Follow-up: AI-DISPO Procurement Inquiry&body=Dear ${encodeURIComponent(q.name)},%0D%0A%0D%0AThank you for your interest in AI-DISPO ${encodeURIComponent(q.product || 'medical devices')}.`;
    }

    queryDetailsModal.style.display = "flex";
  };

  window.updateQueryStatus = async (id, newStatus) => {
    const q = queries.find(item => item.id === id);
    if (q) {
      q.status = newStatus;
      saveLocalQueries();
      if (authToken) {
        try {
          await fetch(`/api/queries/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${authToken}` },
            body: JSON.stringify({ status: newStatus })
          });
        } catch (e) {}
      }
      showToast(`Query status updated to "${newStatus}"`, "info");
      renderQueryTable();
    }
  };

  window.deleteQuery = async (id) => {
    if (!confirm("Are you sure you want to delete this procurement query?")) return;
    if (authToken) {
      try {
        await fetch(`/api/queries/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${authToken}` } });
      } catch (e) {}
    }
    queries = queries.filter(q => q.id !== id);
    saveLocalQueries();
    showToast("Query deleted successfully.", "success");
    renderQueryTable();
  };

  if (btnCloseQueryModal) {
    btnCloseQueryModal.addEventListener("click", () => {
      queryDetailsModal.style.display = "none";
    });
  }
  if (btnCloseQueryModalBtn) {
    btnCloseQueryModalBtn.addEventListener("click", () => {
      queryDetailsModal.style.display = "none";
    });
  }
  if (queryDetailsModal) {
    queryDetailsModal.addEventListener("click", (e) => {
      if (e.target === queryDetailsModal) {
        queryDetailsModal.style.display = "none";
      }
    });
  }

  if (queryStatusFilterEl) {
    queryStatusFilterEl.addEventListener("change", (e) => {
      queryStatusFilter = e.target.value;
      queryCurrentPage = 1;
      renderQueryTable();
    });
  }

  if (queryProductFilterEl) {
    queryProductFilterEl.addEventListener("change", (e) => {
      queryProductFilter = e.target.value;
      queryCurrentPage = 1;
      renderQueryTable();
    });
  }

  if (searchQueryInputEl) {
    searchQueryInputEl.addEventListener("input", (e) => {
      searchQueryVal = e.target.value;
      queryCurrentPage = 1;
      renderQueryTable();
    });
  }

  if (btnExportQueries) {
    btnExportQueries.addEventListener("click", () => {
      if (queries.length === 0) {
        showToast("No queries to export.", "info");
        return;
      }
      const headers = ["ID", "Name", "Organization", "Email", "Phone", "Product", "Volume", "SKU", "Message", "Status", "Received Date"];
      const rows = queries.map(q => [
        q.id,
        `"${(q.name || '').replace(/"/g, '""')}"`,
        `"${(q.organization || '').replace(/"/g, '""')}"`,
        `"${(q.email || '').replace(/"/g, '""')}"`,
        `"${(q.phone || '').replace(/"/g, '""')}"`,
        `"${(q.product || '').replace(/"/g, '""')}"`,
        `"${(q.volume || '').replace(/"/g, '""')}"`,
        `"${(q.sku || '').replace(/"/g, '""')}"`,
        `"${(q.message || '').replace(/"/g, '""')}"`,
        `"${(q.status || 'New').replace(/"/g, '""')}"`,
        `"${q.created_at || ''}"`
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `aidispo_procurement_queries_${new Date().toISOString().substring(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Exported queries CSV successfully!", "success");
    });
  }

  // ==================== 7. UTILITY FUNCTIONS ====================
  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/`/g, "&#96;");
  }

  function sanitizePlainText(input, maxLength = 2000) {
    if (typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/<[^>]*>/g, '')
      .slice(0, maxLength);
  }

  function sanitizeRichHtml(html) {
    if (typeof html !== 'string') return '';
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
      .replace(/<embed\b[^>]*>/gi, '')
      .replace(/<applet\b[^>]*>/gi, '')
      .replace(/<meta\b[^>]*>/gi, '')
      .replace(/<link\b[^>]*>/gi, '')
      .replace(/\son\w+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, '')
      .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"')
      .replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, '');
  }

  function sanitizeSafeUrl(url) {
    if (!url) return "";
    const trimmed = String(url).trim();
    if (/^https?:\/\/[^\s<>"']+$/i.test(trimmed)) {
      return trimmed.slice(0, 500);
    }
    if (/^(\.\.\/|\.\/|assets\/)[a-zA-Z0-9_\-\.\/]+$/i.test(trimmed)) {
      return trimmed;
    }
    return "";
  }

  checkAuth();
});

