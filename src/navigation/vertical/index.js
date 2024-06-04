const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeColor: 'error',
      children: [
        {
          title: 'Analytics',
          path: '/dashboards/analytics'
        },

        {
          title: 'eCommerce',
          path: '/dashboards/ecommerce'
        }
      ]
    },
    {
      sectionTitle: 'Blog & Posts'
    },
    {
      title: 'Posts',
      badgeColor: 'error',
      icon: 'tabler:news',
      children: [
        {
          title: 'Add New Post',
          path: '/apps/post/new'
        },
        {
          title: 'All Posts',
          badgeColor: 'error',
          path: '/apps/post/list'
        }
      ]
    },

    // Post Categories
    {
      title: 'Post Categories',
      badgeColor: 'error',
      badgeContent: 'new',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Add New Category',
          path: '/apps/blog-category/new'
        },
        {
          title: 'All Categories',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/blog-category/list'
        }
      ]
    },
    {
      sectionTitle: 'Courses'
    },

    // Course
    {
      title: 'Courses',
      icon: 'tabler:certificate',
      badgeColor: 'error',
      children: [
        {
          title: 'Add New Course',
          path: '/apps/course/new'
        },
        {
          title: 'All Courses',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/course/list'
        }
      ]
    },

    // Course Category
    {
      title: 'Course Categories',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Add New Category',
          path: '/apps/category/new'
        },
        {
          title: 'All Categories',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/category/list'
        }
      ]
    },

    // Recorded Videos
    {
      title: 'Recorded Videos',
      icon: 'tabler:brand-zoom',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Add New Video',
          path: '/apps/video/new'
        },
        {
          title: 'All Recorded Videos',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/video/list'
        }
      ]
    },

    // Tests
    {
      title: 'Tests',
      icon: 'tabler:a-b',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Add New Test',
          path: '/apps/test/new'
        },
        {
          title: 'All Tests',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/test/list'
        }
      ]
    },
    
    // Enrollments
    {
      title: 'Enrollments',
      icon: 'tabler:list-numbers',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Add New Enrollment',
          path: '/apps/enrollment/new'
        },
        {
          title: 'All Enrollments',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/enrollment/list'
        }
      ]
    },

    //Webinars
    {
      sectionTitle: 'Webinars'
    },
    {
      title: 'Webinars',
      icon: 'tabler:steam',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Add New Webinar',
          path: '/apps/webinar/new'
        },
        {
          title: 'All Webinars',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/webinar/list'
        }
      ]
    },

    {
      sectionTitle: 'Marketings'
    },

    // Coupons
    {
      title: 'Coupons',
      icon: 'tabler:ticket',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Add New Coupon',
          path: '/apps/coupon/new'
        },
        {
          title: 'All Coupons',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/coupon/list'
        }
      ]
    },
    {
      title: 'Transactions',
      icon: 'tabler:file-dollar',
      badgeColor: 'error',
      badgeContent: 'new',
      children: [
        {
          title: 'Transaction List',
          badgeColor: 'error',
          badgeContent: 'new',
          path: '/apps/transaction/list'
        }
      ]
    },
    {
      sectionTitle: 'Media'
    },
    {
      title: 'File Manager',
      icon: 'tabler:folders',
      badgeColor: 'error',
      path: '/apps/filemanager',
    },
    {
      sectionTitle: 'Users'
    },
    {
      title: 'User',
      icon: 'tabler:user',
      children: [
        {
          title: 'Add User',
          path: '/apps/user/new'
        },
        {
          title: 'Users List',
          path: '/apps/user/list'
        }
      ]
    },
    {
      title: 'Roles & Permissions',
      icon: 'tabler:settings',
      children: [
        {
          title: 'Roles',
          path: '/apps/roles'
        },
        {
          title: 'Permissions',
          path: '/apps/permissions'
        }
      ]
    }
  ]
}

export default navigation
