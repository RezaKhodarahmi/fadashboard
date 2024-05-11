import React, { useState, useEffect, useRef } from 'react'
import { Dialog, Button, Grid, TextField, IconButton } from '@mui/material'
import { createNewMedia, fetchAllMedia, deleteMedia } from 'src/store/apps/media'
import { useDispatch, useSelector } from 'react-redux'
import FileCopyIcon from '@mui/icons-material/FileCopy'
import DescriptionIcon from '@mui/icons-material/Description' // Icon for PDF
import InsertChartIcon from '@mui/icons-material/InsertChart' // Icon for CSV
import ArchiveIcon from '@mui/icons-material/Archive' // Icon for ZIP

const getFileTypeFromUrl = url => {
  const extension = url.split('.').pop().toLowerCase()

  switch (extension) {
    case 'pdf':
      return 'application/pdf'
    case 'csv':
      return 'text/csv'
    case 'zip':
      return 'application/zip'
    default:
      return ''
  }
}

const FileManager = () => {
  const [files, setFiles] = useState([])
  const [openModal, setOpenModal] = useState(true)
  const [selectedFile, setSelectedFile] = useState(null)
  const [openedFile, setOpenedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [alternative, setAlternative] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filesPerPage] = useState(30)
  const fileInputRef = useRef(null)

  const medias = useSelector(state => state.media)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllMedia())
  }, [])

  useEffect(() => {
    if (medias?.data?.data) {
      // Sort the files based on the creation date or any other relevant property
      const sortedFiles = [...medias.data.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setFiles(sortedFiles)
      setLoading(false)
    }
  }, [medias])

  const handleFileSelect = event => {
    setSelectedFile(event.target.files[0])
  }

  const handleUpload = async () => {
    setLoading(true)
    const formData = new FormData()
    formData.append('file', selectedFile)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('alternative', alternative)
    await dispatch(createNewMedia(formData))
    setTitle('')
    setDescription('')
    setAlternative('')
    setOpenModal(false)

    await dispatch(fetchAllMedia())
  }

  const openFileDetails = file => {
    setOpenedFile(file)
  }

  const handleCloseModal = () => {
    setOpenedFile(null)
  }

  const handleDeleteFile = async id => {
    // Delete the file from the database

    const confirmation = window.confirm('Do want to delete this file ?')
    if (confirmation) {
      await dispatch(deleteMedia(id))
      setOpenedFile(null)

      // Remove the deleted file from the files state
      setFiles(prevFiles => prevFiles.filter(file => file.id !== id))
    }
  }

  const copyUrlToClipboard = url => {
    navigator.clipboard.writeText(url)
  }

  const paginate = pageNumber => {
    setCurrentPage(pageNumber)
  }

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Dialog open={!!openedFile} onClose={handleCloseModal}>
            <Grid container spacing={2} alignItems='center' style={{ padding: '20px' }}>
              <Grid item xs={12}>
                <h2>File Details</h2>
              </Grid>
              <Grid item xs={12}>
                {openedFile && openedFile.url && (
                  <>
                    {getFileTypeFromUrl(openedFile.url) === 'application/pdf' && <DescriptionIcon />}
                    {getFileTypeFromUrl(openedFile.url) === 'text/csv' && <InsertChartIcon />}
                    {getFileTypeFromUrl(openedFile.url) === 'application/zip' && <ArchiveIcon />}
                    {getFileTypeFromUrl(openedFile.url) === '' && (
                      <img src={openedFile?.url} alt={openedFile?.alt} style={{ maxWidth: '100%' }} />
                    )}
                  </>
                )}
              </Grid>
              <Grid item xs={12}>
                <TextField label='Title' value={openedFile?.name} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label='Description' value={openedFile?.description} disabled />
              </Grid>
              <Grid item xs={12}>
                <TextField label='URL' value={openedFile?.url} disabled />
                <IconButton onClick={() => copyUrlToClipboard(openedFile?.url)}>
                  <FileCopyIcon />
                </IconButton>
              </Grid>
              <Grid item xs={12}>
                <Button
                  onClick={e => handleDeleteFile(openedFile.id)}
                  variant='contained'
                  style={{ color: '#fff', backgroundColor: 'red' }}
                >
                  delete
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button onClick={handleCloseModal} variant='contained' color='primary'>
                  Close
                </Button>
              </Grid>
            </Grid>
          </Dialog>

          <Grid container spacing={2} alignItems='center'>
            <Grid item xs={12}>
              <h2>File Manager</h2>
            </Grid>
            <Grid item xs={12}>
              <input
                type='file'
                ref={fileInputRef}
                id='contained-button-file'
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <label htmlFor='contained-button-file'>
                <Button variant='contained' component='span' style={{ marginRight: '10px' }}>
                  Pick File
                </Button>
              </label>
              <TextField label='Title' value={title} onChange={e => setTitle(e.target.value)} />
              <TextField label='Description' value={description} onChange={e => setDescription(e.target.value)} />
              <TextField label='Alternative' value={alternative} onChange={e => setAlternative(e.target.value)} />
              <Button variant='contained' onClick={handleUpload} style={{ marginLeft: '10px' }}>
                Upload
              </Button>
            </Grid>
            {files.map(file => (
              <Grid item key={file.id} xs={4} style={{ padding: '10px' }}>
                <div
                  onClick={() => openFileDetails(file)}
                  style={{
                    cursor: 'pointer',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '10px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  {file.url && (
                    <>
                      {getFileTypeFromUrl(file.url) === 'application/pdf' && <DescriptionIcon />}
                      {getFileTypeFromUrl(file.url) === 'text/csv' && <InsertChartIcon />}
                      {getFileTypeFromUrl(file.url) === 'application/zip' && <ArchiveIcon />}
                      {getFileTypeFromUrl(file.url) === '' && (
                        <img
                          src={file.url}
                          alt={file.alternative}
                          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <strong>{file.name}</strong>
                      <p>{file.url}</p>
                    </>
                  )}
                  <p
                    style={{
                      marginTop: '10px',
                      textAlign: 'center',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {file.title}
                  </p>
                </div>
              </Grid>
            ))}
          </Grid>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            {files.length > filesPerPage && (
              <div>
                {Array.from({ length: Math.ceil(files.length / filesPerPage) }, (_, index) => (
                  <Button key={index} onClick={() => paginate(index + 1)} style={{ margin: '5px' }}>
                    {index + 1}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default FileManager
