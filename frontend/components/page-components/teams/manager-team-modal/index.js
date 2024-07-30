import React, { useState, useEffect } from 'react'
import { MANAGE_MEMBER, TEAM_START } from '@/configs/api-path'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'

const ManagerTeamModal = ({
  modalTitle = 'Modal Title',
  modalBody,
  open,
  onClose,
  team_id,
  TeamReady,
  memberData = [],
  refreshTeamData,
  // modalW = '840px',
  // modalH = '750px',
}) => {
  const handleMember = async () => {
    const memberStatusData = memberData.map((member) => ({
      no: member.no,
      m_status: member.m_status,
    }))
    console.log('提交資料:', memberStatusData)

    try {
      const response = await fetch(MANAGE_MEMBER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberStatusData),
      })

      const result = await response.json()
      if (response.ok) {
        // alert('已修改')
      } else {
        alert('未進行修改')
      }
    } catch (error) {
      console.error('提交資料時發生錯誤:', error)
    }
  }

  const handleStartTeam = async () => {
    try {
      const response = await fetch(TEAM_START, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ team_id }),
      })

      const result = await response.json()
      if (result.success) {
        alert('團隊已成團')
        refreshTeamData()
      } else {
        alert('團隊成團失敗')
      }
    } catch (error) {
      console.error('提交資料時發生錯誤:', error)
    }
  }

  const handleButtonClick = () => {
    if (TeamReady === 'ready') {
      handleMember()
      handleStartTeam()
    } else if (TeamReady === 'going') {
      handleMember()
    } else if (TeamReady === 'over') {
      return
    }
    onClose()
  }

  const getButtonLabel = () => {
    if (TeamReady === 'ready') {
      return '確認成團'
    } else if (TeamReady === 'over') {
      return '重新設定'
    }
    return '確認'
  }

  useEffect(() => {
    if (TeamReady === 'ready') {
      console.log()
    }
  })

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ ...style, width: '500px' }}>
        <h6 style={modalHeader}>{modalTitle}</h6>
        <hr />
        <div style={modalContent}>
          {modalBody}
          {/* {React.cloneElement(modalBody, {
            onMemberCountChange: handleMemberCountChange,
          })} */}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '1rem',
          }}
        >
          {/* {renderButton()} */}
          <Button
            style={button}
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            {getButtonLabel()}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default ManagerTeamModal

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: modalW,
  // height: modalH,
  bgcolor: 'black',
  // bgcolor: 'background.paper',
  borderRadius: '1rem',
  boxShadow: 'var(--card-shadow)',
  padding: '2.5rem',
  color: '#B99755',
}
const modalHeader = {
  marginBottom: '1.5rem',
  textAlign: 'center',
}

const modalContent = {
  maxHeight: '500px',
  overflowY: 'auto',
  lineHeight: '40px',
}
const button = {
  border: '1px solid black',
  fontFamily: 'Noto Serif JP',
  fontSize: '16px',
  borderRadius: '30px',
  backgroundColor: '#B99755',
  color: 'white',
  padding: '10px 30px',
  '&:hover': {
    backgroundColor: 'white',
    color: '#B99755',
    boxShadow: 'none',
  },
  boxShadow: 'none',
}