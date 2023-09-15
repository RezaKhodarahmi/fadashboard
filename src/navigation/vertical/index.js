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
          title: 'CRM',
          path: '/dashboards/crm'
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
      icon: 'tabler:file',
      children: [
        {
          title: 'Add Post',
          path: '/apps/post/new'
        },
        {
          title: 'Post List',
          path: '/apps/post/list'
        }
      ]
    },

    // Categories
    {
      title: 'Blog Category',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Categories',
          path: '/apps/blog-category/list'
        },
        {
          title: 'Add Category',
          path: '/apps/blog-category/new'
        }
      ]
    },
    {
      sectionTitle: 'Courses'
    },
    {
      title: 'Courses',
      icon: 'tabler:file',
      children: [
        {
          title: 'Add Course',
          path: '/apps/course/new'
        },
        {
          title: 'Courses List',
          path: '/apps/course/list'
        },
        {
          title: 'Videos',
          path: '/apps/video/list'
        },
        {
          title: 'New Video',
          path: '/apps/video/new'
        },
        {
          title: 'Tests',
          path: '/apps/test/list'
        },
        {
          title: 'New test',
          path: '/apps/test/new'
        }
      ]
    },

    //Webinars
    {
      sectionTitle: 'Courses'
    },
    {
      title: 'Webinars',
      icon: 'tabler:file',
      children: [
        {
          title: 'New Webinar',
          path: '/apps/webinar/new'
        },
        {
          title: 'Webinars List',
          path: '/apps/webinar/list'
        }
      ]
    },

    // Categories
    {
      title: 'Course Category',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Categories',
          path: '/apps/category/list'
        },
        {
          title: 'Add Category',
          path: '/apps/category/new'
        }
      ]
    },

    // Categories
    {
      title: 'Discount and coupon',
      icon: 'tabler:layout-grid',
      children: [
        {
          title: 'Coupons',
          path: '/apps/coupon/list'
        },
        {
          title: 'Add new coupon',
          path: '/apps/coupon/new'
        }
      ]
    },
    {
      sectionTitle: 'eCommerce'
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
