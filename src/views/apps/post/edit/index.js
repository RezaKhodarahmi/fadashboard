import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import FormHelperText from '@mui/material/FormHelperText'
import { Editor } from '@tinymce/tinymce-react'
import AppConfig from 'src/configs/appConfg'
import { MultiSelect } from 'react-multi-select-component'
import * as yup from 'yup'
import { Card, CardHeader, CardContent, TextField, Button, Grid, Select, MenuItem, FormControl, InputLabel, Box, Badge } from '@mui/material'
import { updatePost } from 'src/store/apps/post'
import { fetchCategoriesData, deletePostCategory } from 'src/store/apps/blog-category'
import { deleteTag, newTag } from 'src/store/apps/blog-tag'
import { useDispatch, useSelector } from 'react-redux'
import { yupResolver } from '@hookform/resolvers/yup'
import { getAuthors } from 'src/store/apps/user'

const validationSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  description: yup.string().nullable(),
  summary: yup.string().nullable(),
  keywords: yup.string().nullable(),
  metaTitle: yup.string().nullable(),
  metaDescription: yup.string().nullable(),
  published: yup.string().required('This field is required'),
  image: yup.string().nullable()
})

export default function EditForm(props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(validationSchema)
  })

  const users = useSelector(state => state.user)

  const dispatch = useDispatch()

  //Set state
  const [published, setPublished] = useState(null)
  const [categoryId, setCategoryId] = useState([{ label: 'Select category', value: '0' }])
  const [postId, setPostId] = useState(null)
  const [tags, setTags] = useState(null)
  const [tagInputValue, setTagInputValue] = useState('')
  const [file, setFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [authorId, setAuthorId] = useState(null)

  const handleFileChange = e => {
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const tagData = useSelector(state => state.blogTag)
  const allCategories = useSelector(state => state.blogCategoryList)

  useEffect(() => {
    if (tagData.data?.data) {
      const oldTags = [...tags]
      oldTags.push({ title: tagData.data.data.title, id: tagData.data.data.id })
      setTags(oldTags)
    }
  }, [tagData.data?.data])

  useEffect(() => {
    dispatch(fetchCategoriesData())
    dispatch(getAuthors())
  }, [dispatch, postId])

  useEffect(() => {
    if (props.postData) {
      reset(props.postData)
      setPublished(props.postData.published)
      setPostId(props.postData.id)
      setImageUrl(props.postData.image)
      setAuthorId(props.postData.authorId)
      setCategoryId(
        props.postData.BlogCategories?.map(cat => {
          return {
            label: cat.title,
            value: cat.id
          }
        })
      )
      setTags(props.postData.BlogTags)
    }
  }, [props.postData])

  const onSubmit = data => {
    const postTags = [...tags]
    const category = [...categoryId]
    const formData = new FormData()
    formData.append('id', postId)
    formData.append('cats', JSON.stringify(category))
    formData.append('tags', JSON.stringify(postTags))

    if (file) {
      formData.append('image', file)
    }

    for (const key in data) {
      formData.append(key, data[key])
    }

    dispatch(updatePost(formData))
  }

  const handelRemoveTag = tagId => {
    const confirmation = window.confirm('Do you really want to remove Tag?')
    if (confirmation) {
      dispatch(deleteTag({ tagId: tagId, postId: postId }))
      const oldTags = [...tags]

      const newTags = oldTags.filter(tag => tag.id !== tagId)

      setTags(newTags)
    }
  }

  const handelRemoveCategory = catId => {
    const confirmation = window.confirm('Do you really want to remove Category?')
    if (confirmation) {
      dispatch(deletePostCategory({ catId: catId, postId: postId }))
      const oldCats = [...categoryId]
      if (oldCats?.length > 1) {
        const newCat = oldCats.filter(cat => cat.value !== catId)
        setCategoryId(newCat)
      }
    }
  }

  const handleTagsInputChange = event => {
    setTagInputValue(event.target.value)
  }

  const handleKeyPressTags = event => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      handleEnterKeyPressTags()
      event.target.value = ''
    }
  }

  const handleEnterKeyPressTags = () => {
    dispatch(newTag({ title: tagInputValue, postId: postId }))
  }

  const showCategories = allCategories?.data?.data?.map(cat => {
    return {
      label: cat.title,
      value: cat.id
    }
  }) || {
    label: 'uncategorized',
    value: '0'
  }

  return (
    <>
      <Card>
        <CardHeader title='Edit Post' />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' {...register('id')} />

            <Grid container spacing={2}>
              {/* Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('title')} label='Title' focused fullWidth />
                {errors.title && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-title-helper'>
                    {errors.title.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Slug */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('slug')} label='Slug' focused fullWidth />
                {errors.slug && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-slug-helper'>
                    {errors.slug.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Description */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='description'>Description</InputLabel>
                <Controller
                  name='description'
                  labelId='description'
                  control={control}
                  rules={validationSchema.description}
                  render={({ field, fieldState }) => (
                    <Box sx={{ mt: 2 }}>
                      <Editor
                        apiKey={AppConfig.TINYMCE_KEY}
                        value={field.value}
                        onEditorChange={value => field.onChange(value)}
                        onBlur={field.onBlur}
                        init={AppConfig.TINYMCE_INIT}
                      />
                      {fieldState.error && <Box sx={{ color: 'red', mt: 1 }}>{fieldState.error.message}</Box>}
                    </Box>
                  )}
                />
              </Grid>

              {/* Summary */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <InputLabel id='description'>Summary</InputLabel>
                <Controller
                  name='summary'
                  labelId='Summary'
                  control={control}
                  rules={validationSchema.summary}
                  render={({ field, fieldState }) => (
                    <Box sx={{ mt: 2 }}>
                      <Editor
                        apiKey={AppConfig.TINYMCE_KEY}
                        value={field.value}
                        onEditorChange={value => field.onChange(value)}
                        onBlur={field.onBlur}
                        init={AppConfig.TINYMCE_INIT}
                      />
                      {fieldState.error && <Box sx={{ color: 'red', mt: 1 }}>{fieldState.error.message}</Box>}
                    </Box>
                  )}
                />
              </Grid>

              {/* Keywords */}
              <Grid marginTop={5} item xs={12} sm={6}>
                <TextField {...register('keywords')} label='Keywords' focused fullWidth />
                {errors.keywords && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-keywords-helper'>
                    {errors.keywords.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Meta Title */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('metaTitle')} label='Meta Title' focused fullWidth />
                {errors.metaTitle && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaTitle-helper'>
                    {errors.metaTitle.message}
                  </FormHelperText>
                )}
              </Grid>

                {/* Meta Description */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField {...register('metaDescription')} label='Meta Description' focused fullWidth />
                {errors.metaDescription && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-metaDescription-helper'>
                    {errors.metaDescription.message}
                  </FormHelperText>
                )}
              </Grid>

              {/* Author */}
              {authorId ? (
                <Grid marginTop={5} item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel id='authorId-select-label'>Author</InputLabel>
                    <Select {...register('authorId')} defaultValue={authorId} labelId='authorId-select-label' label='Author'>
                      <MenuItem value={'0'}>Select Author</MenuItem>
                      {users
                        ? users?.data?.data?.map(user => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.firstName + ' ' + user.lastName}
                          </MenuItem>
                        ))
                        : null}
                    </Select>
                  </FormControl>

                  {errors.authorId && (
                    <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-authorId-helper'>
                      {errors.authorId.message}
                    </FormHelperText>
                  )}
                </Grid>
              ) : null}
              <Grid item xs={12} sm={9}></Grid>

              {/* Publishing Status */}
              <Grid marginTop={5} item xs={12} sm={3}>
                {published !== null ? (
                  <FormControl fullWidth>
                    <InputLabel id='enroll-select-label'>Status</InputLabel>
                    <Select
                      {...register('published')}
                      defaultValue={published}
                      labelId='published-select-label'
                      label='Status'
                    >
                      <MenuItem value={'1'}>Yes</MenuItem>
                      <MenuItem value={'0'}>No</MenuItem>
                      <MenuItem value={'2'}>Pending review</MenuItem>
                    </Select>
                  </FormControl>
                ) : null}
                {errors.published && (
                  <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-published-helper'>
                    {errors.published.message}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12} sm={9}></Grid>

              {/* Category */}
              {categoryId ? (
                <Grid marginTop={5} item xs={12} sm={6} style={{ zIndex: '999' }}>
                  <InputLabel>Category</InputLabel>
                  <MultiSelect options={showCategories} value={categoryId} onChange={setCategoryId} labelledBy='Select' />
                  <Grid marginTop={5} xs={12} sm={12}>
                    {categoryId?.map(cat => (
                      <Button
                        color='primary'
                        key={cat.value}
                        onClick={e => handelRemoveCategory(cat.value)}
                        style={{ backgroundColor: 'rgb(115 100 240 / 11%)', margin: '0 5px' }}
                      >
                        {cat.label} <span className='badge  badge-sm' style={{ margin: '10px' }}></span>
                        <Badge badgeContent={'x'} color='primary' />
                      </Button>
                    ))}
                  </Grid>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={6}></Grid>

              {/* Tags */}
              <Grid marginTop={5} item xs={12} sm={12}>
                <TextField onChange={handleTagsInputChange} onKeyPress={handleKeyPressTags} label='Post tags' fullWidth />
                <Grid marginTop={5} xs={12} sm={12}>
                  {tags
                    ? tags?.map(tag => (
                      <Button
                        color='primary'
                        key={tag.id}
                        onClick={e => handelRemoveTag(tag.id)}
                        style={{ backgroundColor: 'rgb(115 100 240 / 11%)', margin: '0 5px' }}
                      >
                        {tag.title} <span className='badge  badge-sm' style={{ margin: '10px' }}></span>
                        <Badge badgeContent={'x'} color='primary' />
                      </Button>
                    ))
                    : null}
                </Grid>
              </Grid>
              <Grid marginTop={5} item xs={12} sm={6} flex>
                <img alt='Image' src={imageUrl} width='100' />
                <input type='file' name='image' onChange={handleFileChange} />
              </Grid>
            </Grid>

            <Grid marginTop={10} item xs={12} sm={6}>
              <Button type='submit' size='large' variant='contained' color='success'>
                Update
              </Button>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </>
  )
}
