import { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Button, TextField, Typography, IconButton } from '@mui/material'
import { Editor } from '@tinymce/tinymce-react'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast, Toaster } from 'react-hot-toast'
import AppConfig from 'src/configs/appConfg'
import BASE_URL from 'src/api/BASE_URL'

const FaqForm = ({ courseId }) => {
  const [faqs, setFaqs] = useState([{ id: null, title: '', description: '' }])
  const accessToken = localStorage.getItem('accessToken')

  useEffect(() => {
    // Fetch existing FAQs when component mounts
    const fetchFaqs = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/faq?courseId=${courseId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        console.log(response)

        if (response.data && response.data.data) {
          setFaqs(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      }
    }

    fetchFaqs()
  }, [courseId, accessToken])

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const newFaqs = [...faqs]
    newFaqs[index][name] = value
    setFaqs(newFaqs)
  }

  const handleEditorChange = (index, content) => {
    const newFaqs = [...faqs]
    newFaqs[index].description = content
    setFaqs(newFaqs)
  }

  const addFaqField = () => {
    setFaqs([...faqs, { id: null, title: '', description: '' }])
  }

  const handleDelete = async (index, faqId) => {
    if (faqId) {
      try {
        await axios.delete(`${BASE_URL}/faq/${faqId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        toast.success('FAQ deleted successfully')
      } catch (error) {
        console.error('Error deleting FAQ:', error)
        toast.error('Error deleting FAQ')
      }
    }

    const newFaqs = faqs.filter((_, i) => i !== index)
    setFaqs(newFaqs)
  }

  const handleSubmit = async event => {
    event.preventDefault()

    const faqsWithCourseId = faqs.map(faq => ({ ...faq, courseId }))
    try {
      await axios.post(
        `${BASE_URL}/faq/update`,
        { faqs: faqsWithCourseId },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      toast.success('FAQs updated successfully')
    } catch (error) {
      console.error('Error creating or updating FAQs:', error)
      toast.error('Error creating or updating FAQs')
    }
  }

  return (
    <Box component='form' onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <Typography variant='h4' gutterBottom>
        Add FAQs
      </Typography>

      {faqs.map((faq, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          <TextField
            label='Question'
            variant='outlined'
            name='title'
            value={faq.title}
            onChange={event => handleChange(index, event)}
            required
            fullWidth
            sx={{ mb: 2 }}
          />
          <Typography variant='body1' sx={{ mb: 1 }}>
            Answer:
          </Typography>
          <Editor
            apiKey={AppConfig.TINYMCE_KEY}
            value={faq.description}
            onEditorChange={content => handleEditorChange(index, content)}
            init={AppConfig.TINYMCE_INIT}
          />
          <IconButton onClick={() => handleDelete(index, faq.id)} color='error' sx={{ mt: 2 }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button variant='contained' onClick={addFaqField} sx={{ mr: 2 }}>
        Add Another FAQ
      </Button>
      <Button type='submit' variant='contained' color='primary'>
        Submit
      </Button>
      <Toaster />
    </Box>
  )
}

export default FaqForm
