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
  const menuItemJobs = document.getElementById("menuItemJobs");
  const menuItemPostJob = document.getElementById("menuItemPostJob");
  const menuItemApplicants = document.getElementById("menuItemApplicants");
  const navBlog = document.getElementById("navBlog");
  const navJobs = document.getElementById("navJobs");
  const navPostJob = document.getElementById("navPostJob");
  const navApplicants = document.getElementById("navApplicants");
  const applicantsCountBadge = document.getElementById("applicantsCountBadge");

  // Views
  const viewBlogList = document.getElementById("viewBlogList");
  const viewPostBlog = document.getElementById("viewPostBlog");
  const viewJobList = document.getElementById("viewJobList");
  const viewPostJob = document.getElementById("viewPostJob");
  const viewApplicants = document.getElementById("viewApplicants");

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

  function showLogin() {
    loginOverlay.style.display = "flex";
    adminLayout.style.display = "none";
    if (adminEmailInput) adminEmailInput.value = "";
    if (adminPassInput) adminPassInput.value = "";
    if (loginAlert) loginAlert.style.display = "none";
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
    [viewBlogList, viewPostBlog, viewJobList, viewPostJob, viewApplicants].forEach(v => {
      if (v) v.classList.remove("active");
    });
    [menuItemBlog, menuItemJobs, menuItemPostJob, menuItemApplicants].forEach(m => {
      if (m) m.classList.remove("active");
    });

    if (viewName === "blog-list") {
      viewBlogList.classList.add("active");
      menuItemBlog.classList.add("active");
    } else if (viewName === "blog-post") {
      viewPostBlog.classList.add("active");
      menuItemBlog.classList.add("active");
    } else if (viewName === "job-list") {
      viewJobList.classList.add("active");
      menuItemJobs.classList.add("active");
    } else if (viewName === "job-post") {
      viewPostJob.classList.add("active");
      menuItemPostJob.classList.add("active");
    } else if (viewName === "applicants") {
      viewApplicants.classList.add("active");
      menuItemApplicants.classList.add("active");
    }

    if (window.innerWidth <= 900) {
      adminSidebar.classList.remove("open");
      sidebarBackdrop.classList.remove("active");
    }
  }

  // Nav menu listeners
  navBlog.addEventListener("click", (e) => { e.preventDefault(); switchView("blog-list"); });
  navJobs.addEventListener("click", (e) => { e.preventDefault(); switchView("job-list"); });
  navPostJob.addEventListener("click", (e) => { 
    e.preventDefault(); 
    resetJobForm(); 
    jobFormTitle.textContent = "Post Job"; 
    btnSubmitJob.textContent = "Publish Job"; 
    currentEditingJobId = null; 
    switchView("job-post"); 
  });
  navApplicants.addEventListener("click", (e) => { e.preventDefault(); switchView("applicants"); });

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
    const title = blogTitle.value.trim();
    const meta_title = blogMetaTitle.value.trim() || title;
    const meta_description = blogMetaDesc.value.trim();
    let slug = blogSlug.value.trim() || title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-");
    const badge_tag = blogCategoryBadge.value.trim().toUpperCase() || "IV CANNULA";
    const tags = blogTags.value.trim() || badge_tag;
    const image_url = blogImageUrl.value.trim() || "../assets/prod_syringe.jpg";
    const content = blogEditorInstance ? blogEditorInstance.getData() : "";

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
      const statusClass = (job.status || "Active").toLowerCase();
      return `
        <tr>
          <td class="col-sno">${idx + 1}</td>
          <td style="font-weight: 600;">
            <a href="../careers.html" target="_blank" style="color: inherit; text-decoration: none;">${escapeHtml(job.title)}</a>
          </td>
          <td><span class="job-badge">${job.department}</span></td>
          <td style="color: #64748b; font-size: 12.5px;">${job.location || 'HQ, India'}</td>
          <td><span class="job-badge type">${job.job_type || 'Full-Time'}</span></td>
          <td style="text-align: center;">
            <button class="filter-pill" style="padding: 3px 10px; font-size: 11px;" onclick="window.filterApplicantsByJob(${job.id})">
              👥 ${count} Applicants
            </button>
          </td>
          <td style="text-align: center;">
            <span class="status-badge ${statusClass}">${job.status || 'Active'}</span>
          </td>
          <td class="col-action">
            <button class="action-btn edit" title="Edit Job" onclick="window.editJob(${job.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            </button>
            <button class="action-btn delete" title="Delete Job" onclick="window.deleteJob(${job.id})">
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

    const title = jobTitle.value.trim();
    const department = jobDepartment.value;
    const location = jobLocation.value.trim() || "Facility HQ, India";
    const job_type = jobType.value;
    const experience = jobExperience.value.trim() || "2-5 Years";
    const status = jobStatus.value;
    const requirements = jobRequirements.value.trim();
    const description = jobEditorInstance ? jobEditorInstance.getData() : "";

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
      const date = app.applied_at ? app.applied_at.substring(0, 10) : "2026-10-02";
      return `
        <tr>
          <td class="col-sno">${idx + 1}</td>
          <td style="font-weight: 700; color: #013572;">
            <a href="javascript:void(0)" onclick="window.viewApplicantDetails(${app.id})" style="color: inherit; text-decoration: underline;">
              ${escapeHtml(app.full_name)}
            </a>
          </td>
          <td><span class="job-badge">${escapeHtml(app.job_title || 'General')}</span></td>
          <td style="font-size: 12.5px;">
            <div>📧 <a href="mailto:${app.email}" style="color: #2563eb;">${escapeHtml(app.email)}</a></div>
            <div style="color: #64748b;">📞 ${escapeHtml(app.phone || 'N/A')}</div>
          </td>
          <td style="font-size: 12.5px; color: #475569;">${escapeHtml(app.experience || 'N/A')}</td>
          <td style="font-family: var(--font-mono); font-size: 12px; color: #64748b;">${date}</td>
          <td style="text-align: center;">
            <select class="status-select" onchange="window.updateApplicantStatus(${app.id}, this.value)">
              <option value="Pending" ${app.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
              <option value="Shortlisted" ${app.status === 'Shortlisted' ? 'selected' : ''}>⭐ Shortlisted</option>
              <option value="Interviewed" ${app.status === 'Interviewed' ? 'selected' : ''}>🗣️ Interviewed</option>
              <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>❌ Rejected</option>
            </select>
          </td>
          <td class="col-action">
            <button class="action-btn edit" title="View Candidate Application" onclick="window.viewApplicantDetails(${app.id})">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button class="action-btn delete" title="Delete Applicant" onclick="window.deleteApplicant(${app.id})">
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

    appModalName.textContent = app.full_name;
    appModalJob.textContent = `Position Applied: ${app.job_title || 'General'}`;
    appModalEmail.innerHTML = `<a href="mailto:${app.email}" style="color: #2563eb;">${app.email}</a>`;
    appModalPhone.innerHTML = `<a href="tel:${app.phone}" style="color: #2563eb;">${app.phone}</a>`;
    appModalExp.textContent = app.experience || "Not specified";
    
    if (app.resume_url) {
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

  // ==================== 6. UTILITY FUNCTIONS ====================
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
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  checkAuth();
});
