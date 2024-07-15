import React from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import styles from './basic-modal.module.css'

export default function BasicModal02({
  modalTitle = 'Modal Title',
  modalBody,
  open,
  onClose,
  modalW = '840px',
  modalH = '750px',
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: modalW,
    height: modalH,
    bgcolor: 'background.paper',
    borderRadius: '1rem',
    boxShadow: 'var(--card-shadow)',
    padding: '2.5rem',
  }

  const button = {
    border: '1px solid black',
    fontFamily: 'Noto Serif JP',
    fontSize: '16px',
    borderRadius: '30px',
    backgroundColor: 'white',
    color: '#222222',
    padding: '10px 30px',
    '&:hover': {
      backgroundColor: '#222222',
      color: 'white',
      boxShadow: 'none',
    },
    boxShadow: 'none',
  }

  return (
    <Modal open={open} onClose={() => {}}>
      <Box sx={style}>
        <h6 className={styles.modalHeader}>{modalTitle}</h6>
        <hr></hr>
        <div
          className={styles.modalContent}
          style={{ maxHeight: '500px', overflowY: 'auto', lineHeight: '40px' }}
        >
          {modalBody}
        </div>
        <hr></hr>
        <div style={{ letterSpacing: '1.4px' }}>
          如有任何疑問請直接私訊粉絲團或來電 0928-007799/0907-101822
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '1rem',
          }}
        >
          <Button sx={button} variant="contained" onClick={onClose}>
            確定
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
