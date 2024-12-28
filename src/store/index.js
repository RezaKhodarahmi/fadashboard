// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import course from 'src/store/apps/course'
import { categoryListReducer, categoryReducer } from 'src/store/apps/category'
import { blogCategory, blogCategoryList } from 'src/store/apps/blog-category'
import { cycleReducer, cycleListReducer } from 'src/store/apps/cycle'
import blogTag from 'src/store/apps/blog-tag'
import demosession from 'src/store/apps/demo-session'
import posts from 'src/store/apps/post'
import video from 'src/store/apps/video'
import test from 'src/store/apps/test'
import question from 'src/store/apps/question'
import media from 'src/store/apps/media'
import answer from 'src/store/apps/answer'
import coupon from 'src/store/apps/coupon'
import plans from 'src/store/apps/plans'
import transaction from 'src/store/apps/transaction'
import enrollment from 'src/store/apps/enrollment'
import activecamp from 'src/store/apps/activecampaing'
import adminLogin from 'src/store/apps/admin-login'
import webinar from 'src/store/apps/webinar'
import zoomLinks from 'src/store/apps/zoom-links'
import appointment from 'src/store/apps/appointment'

export const store = configureStore({
  reducer: {
    user,
    video,
    plans,
    test,
    activecamp,
    webinar,
    coupon,
    posts,
    question,
    transaction,
    enrollment,
    answer,
    course,
    cycleReducer,
    cycleListReducer,
    categoryReducer,
    categoryListReducer,
    blogCategory,
    blogCategoryList,
    blogTag,
    media,
    appointment,
    adminLogin,
    zoomLinks,
    demosession
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
