// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import user from 'src/store/apps/user'
import course from 'src/store/apps/course'
import { categoryListReducer, categoryReducer } from 'src/store/apps/category'
import { blogCategory, blogCategoryList } from 'src/store/apps/blog-category'
import { cycleReducer, cycleListReducer } from 'src/store/apps/cycle'
import blogTag from 'src/store/apps/blog-tag'
import posts from 'src/store/apps/post'
import video from 'src/store/apps/video'
import test from 'src/store/apps/test'
import question from 'src/store/apps/question'
import answer from 'src/store/apps/answer'
import coupon from 'src/store/apps/coupon'
import transaction from 'src/store/apps/transaction'
import enrollment from 'src/store/apps/enrollment'
import activecamp from 'src/store/apps/activecampaing'
import webinar from 'src/store/apps/webinar'

export const store = configureStore({
  reducer: {
    user,
    video,
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
    blogTag
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
