const navigation = () => {
  return [
    {
      title: 'Dashboards',
      icon: 'tabler:smart-home',
      badgeColor: 'error',
      children: [
        {
          title: 'Analytics',
          path: '/dashboards/analytics',
          action: 'manage',
          subject: 'analytics-page'
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
          path: '/apps/post/new',
          action: 'manage',
          subject: 'new-post-page'
        },
        {
          title: 'All Posts',
          path: '/apps/post/list',
          action: 'manage',
          subject: 'post-list-page'
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
          path: '/apps/blog-category/new',
          action: 'manage',
          subject: 'new-post-category-page'
        },
        {
          title: 'All Categories',
          path: '/apps/blog-category/list',
          action: 'manage',
          subject: 'post-list-category-page'
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
          path: '/apps/course/new',
          action: 'manage',
          subject: 'new-course-page'
        },
        {
          title: 'All Courses',
          path: '/apps/course/list',
          action: 'manage',
          subject: 'course-list-page'
        },
        {
          title: 'Demo requests',
          path: '/apps/demo-session/list',
          action: 'manage',
          subject: 'course-requests-page'
        }
      ]
    },
    {
      title: 'ZOOM Links',
      icon: 'tabler:link',
      badgeColor: 'error',
      children: [
        {
          title: 'Links',
          path: '/apps/zoom-links/list',
          action: 'manage',
          subject: 'zoom-links'
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
          path: '/apps/category/new',
          action: 'manage',
          subject: 'new-course-category-page'
        },
        {
          title: 'All Categories',
          path: '/apps/category/list',
          action: 'manage',
          subject: 'course-list-category-page'
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
          path: '/apps/video/new',
          action: 'manage',
          subject: 'video-new-page'
        },
        {
          title: 'All Recorded Videos',
          path: '/apps/video/list',
          action: 'manage',
          subject: 'video-list-page'
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
          path: '/apps/test/new',
          action: 'manage',
          subject: 'new-video-page'
        },
        {
          title: 'All Tests',
          path: '/apps/test/list',
          action: 'manage',
          subject: 'test-list-page'
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
          path: '/apps/enrollment/new',
          action: 'manage',
          subject: 'new-enrollment-page'
        },
        {
          title: 'All Enrollments',
          path: '/apps/enrollment/list',
          action: 'manage',
          subject: 'enrollment-list-page'
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
          path: '/apps/webinar/new',
          action: 'manage',
          subject: 'new-webinar-page'
        },
        {
          title: 'All Webinars',
          path: '/apps/webinar/list',
          action: 'manage',
          subject: 'webinar-list-page'
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
          path: '/apps/coupon/new',
          action: 'manage',
          subject: 'new-coupon-page'
        },
        {
          title: 'All Coupons',
          path: '/apps/coupon/list',
          action: 'manage',
          subject: 'webinar-list-page'
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
        },
        {
          title: 'New Transaction ',
          path: '/apps/transaction/new'
        }
      ]
    },
    {
      sectionTitle: 'Media'
    },
    {
      title: 'File Manager',
      icon: 'tabler:folders',
      path: '/apps/filemanager',
      action: 'manage',
      subject: 'file-manager-page'
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
      title: 'Appointments',
      icon: 'tabler:calendar',

      children: [
        {
          title: 'Add New Book',
          path: '/apps/appointment/new'
        },
        {
          title: 'Experiences Appointments List',
          path: '/apps/appointments/experience'
        },
        {
          title: 'Work-study Appointments List',
          path: '/apps/appointments/work'
        }
      ]
    }
  ]
}

navigation.acl = {
  action: 'manage',
  subject: 'vertical-nav-page'
}

export default navigation
