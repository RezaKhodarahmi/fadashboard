const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeContent: 'new',
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
      title: 'File Manager',
      icon: 'tabler:folders',
      badgeContent: 'new',
      badgeColor: 'error',
      children: [
        {
          title: 'File Manager',
          path: '/apps/filemanager'
        }
      ]
    },
    {
      sectionTitle: 'Blog & Posts'
    },
    {
      title: 'Posts',
      icon: 'tabler:news',
      children: [
        {
          title: 'Add New Post',
          path: '/apps/post/new'
        },
        {
          title: 'All Posts',
          path: '/apps/post/list'
        }
      ]
    },

    // Post Categories
    {
      title: 'Post Categories',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Add New Category',
          path: '/apps/blog-category/new'
        },
        {
          title: 'All Categories',
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
      children: [
        {
          title: 'Add New Course',
          path: '/apps/course/new'
        },
        {
          title: 'All Courses',
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
          path: '/apps/category/list'
        }
      ]
    },

    // Recorded Videos
    {
      title: 'Recorded Videos',
      icon: 'tabler:brand-zoom',
      children: [
        {
          title: 'Add New Video',
          path: '/apps/video/new'
        },
        {
          title: 'All Recorded Videos',
          path: '/apps/video/list'
        }
      ]
    },

    // Tests
    {
      title: 'Tests',
      icon: 'tabler:a-b',
      children: [
        {
          title: 'Add New Test',
          path: '/apps/test/new'
        },
        {
          title: 'All Tests',
          path: '/apps/test/list'
        }
      ]
    },
    
    // Enrollments
    {
      title: 'Enrollments',
      icon: 'tabler:list-numbers',
      children: [
        {
          title: 'Add New Enrollment',
          path: '/apps/enrollment/new'
        },
        {
          title: 'All Enrollments',
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
      children: [
        {
          title: 'Add New Webinar',
          path: '/apps/webinar/new'
        },
        {
          title: 'All Webinars',
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
      children: [
        {
          title: 'Add New Coupon',
          path: '/apps/coupon/new'
        },
        {
          title: 'All Coupons',
          path: '/apps/coupon/list'
        }
      ]
    },
    {
      title: 'Transactions',
      icon: 'tabler:file-dollar',
      children: [
        {
          title: 'Transaction List',
          path: '/apps/transaction/list'
        }
      ]
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
