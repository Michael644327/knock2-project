// checkout page
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import styles from './checkout-page.module.css'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import OrderItemCheckout from '../../orders/order-item-checkout'
import BlackBtn from '@/components/UI/black-btn'
import VDivider from '@/components/UI/divider/vertical-divider'
import RecipientButton from '../recipient-button'
import RecipientButtonSelected from '../recipient-button-selected'
import BasicModal from '@/components/UI/basic-modal'
import RecipientModalBody from '../recipient-modal-body'
import OrderInputBox from '../order-input-box'
import OrderSelectBox from '../order-select-box'
import NoData from '@/components/UI/no-data'
import CheckoutTotalTable from './checkout-total-table'
import { PRODUCT_IMG, CHECKOUT_GET, CHECKOUT_POST, ECPAY_GET } from '@/configs/api-path'

export default function CheckOutPage() {
  const router = useRouter()
  const { auth } = useAuth() // 取得 auth.id
  const [memberAddress, setMemberAddress] = useState([])
  const [deliverFee, setDeliverFee] = useState(120)
  const [invoiceTypeValue, setInvoiceTypeValue] = useState('member')
  const [formData, setFormData] = useState({
    memberId: 0,
    recipientName: '',
    recipientMobile: '',
    recipientDistrictId: 1,
    recipientAddress: '',
    // invoice_type: '',
    memberInvoice: 0,
    mobileInvoice: '',
    recipientTaxId: '',
    orderItems: [],
  })

  // 發票形式
  const invoiceTypeOption = [
    { value: 'member', text: '會員載具' },
    { value: 'mobile', text: '手機載具' },
    { value: 'tax', text: '統一編號' },
  ]

  // 取得會員購物車資料、更新訂單總金額、接收商品數量變化
  const { checkoutItems, checkoutTotal, handleQuantityChange, clearCart } =
    useCart()

  // 取得會員地址
  const fetchMemberAddress = async () => {
    try {
      const response = await fetch(`${CHECKOUT_GET}?member_id=${auth.id}`)

      if (!response.ok) {
        throw new Error('Failed to fetch member address')
      }

      const data = await response.json()
      const updatedMemberAddress = data.memberAddresses.map((v) => ({
        ...v,
        selected: false,
      }))

      // 取得預設地址（type='1'）
      const defaultAddress =
        updatedMemberAddress.find((v) => v.type == 1) || updatedMemberAddress[0]
      defaultAddress.selected = true

      setMemberAddress(updatedMemberAddress)
    } catch (error) {
      console.log('Error member address:', error)
    }
  }

  // 更新已經選擇的地址
  const handleAddressSelected = (address) => {
    setMemberAddress(address)
  }

  // 控制表單輸入欄位，更新 formData
  const handleInputChange = (e) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleInvoiceTypeChange = (e) => {
    const value = e.target.value
    console.log(value)
    setInvoiceTypeValue(value)

    // 根據不同的 invoice_type 更新 formData 中的相應欄位
    switch (value) {
      case 'member':
        setFormData({
          ...formData,
          memberInvoice: 1,
          mobileInvoice: '',
          recipientTaxId: '',
        })
        break
      case 'mobile':
        setFormData({
          ...formData,
          memberInvoice: 0,
          recipientTaxId: '',
        })
        break
      case 'tax':
        setFormData({
          ...formData,
          memberInvoice: 0,
          mobileInvoice: '',
        })
        break
      default:
        break
    }
  }

  // 送出表單
  const handleSubmit = async (e) => {
    e.preventDefault()

    // 取得收件人資料
    const recipientData = memberAddress.filter((v) => v.selected === true)

    // 將 checkoutItems 轉換為 orderItems 格式
    const orderItems = checkoutItems.map((item) => ({
      productId: item.product_id,
      productOriginalPrice: item.price,
      orderQty: item.cart_product_quantity,
    }))

    const dataToSubmit = {
      ...formData,
      memberId: auth.id,
      recipientName: recipientData[0].recipient_name, // 收件人姓名
      recipientMobile: recipientData[0].mobile_phone, // 收件人手機號碼
      recipientDistrictId: recipientData[0].district_id, // 收件人區域 ID
      recipientAddress: recipientData[0].address, // 收件人地址
      orderItems, // 將 orderItems 加入到要提交的數據中
    }

    try {
      // Step 1: 提交訂單和商品資料到後端
      const response = await axios.post(CHECKOUT_POST, dataToSubmit)
      if (response.data.success) {
        const orderId = response.data.orderId // 取得後端返回的 order_id

        // Step 2: 送 orderId, checkoutTotal 給後端
        const ecpayResponse = await axios.get(ECPAY_GET, {
          params: {
            orderId,
            checkoutTotal,
          },
        })

        if (ecpayResponse.data.success) {
          // Step 3: 導向新的支付頁面
          router.push({
            pathname: '/ecpay-checkout',
            query: {
              html: encodeURIComponent(ecpayResponse.data.html),
            },
          })
          console.log('ECPay URL: ', ecpayResponse.data.html)
        }
        clearCart()
      }
    } catch (error) {
      console.error('提交表單時出錯', error)
    }
  }

  // 關閉 recipientModalBody
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = async () => {
    await fetchMemberAddress()
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (auth.id) {
      fetchMemberAddress()
    }
  }, [auth.id])

  return (
    <section className={styles.sectionContainer}>
      <h2 className={styles.h2Style}>結帳</h2>

      <form
        id="_form_aiochk"
        method="post"
        name="checkoutForm"
        onSubmit={handleSubmit}
        className={styles.contentContainer}
      >
        {/* LEFT ORDER INFO START */}
        <div className={styles.checkoutLeft}>
          <h5>訂購資訊</h5>
          {/* OrderItemCheckout */}
          <div className={styles.itemList}>
            {checkoutItems.length === 0 ? (
              <NoData />
            ) : (
              checkoutItems.map((v, i) => (
                <OrderItemCheckout
                  key={v.product_id}
                  cartId={v.cart_id}
                  productId={v.product_id}
                  productName={v.product_name}
                  productOriginalPrice={v.price}
                  productDiscountedPrice={v.price}
                  productImg={`${PRODUCT_IMG}/${v.product_img}`}
                  orderQty={v.cart_product_quantity}
                  onQuantityChange={handleQuantityChange}
                />
              ))
            )}
          </div>

          {/* 訂單金額 */}
          <CheckoutTotalTable 
            subtotal={checkoutTotal}
            deliverFee={deliverFee}
            totalDiscount={0}
          />
        </div>

        <VDivider margin="2rem 0" />
        {/* RIGHT RECIPIENT INFO START */}
        <div className={styles.checkoutRight}>
          <h5>收件資料</h5>

          {/* RecipientButton */}
          <div className={styles.checkoutRightMain}>
            {memberAddress.length === 0 ? (
              <RecipientButton onClick={openModal} />
            ) : (
              memberAddress
                .filter((v) => v.selected === true)
                .map((address) => (
                  <RecipientButtonSelected
                    key={address.id}
                    recipientName={address.recipient_name}
                    recipientMobile={address.mobile_phone}
                    address={address.address}
                    onClick={openModal}
                  />
                ))
            )}

            <OrderSelectBox
              name="invoice_type"
              label="發票形式"
              placeholder="請選擇"
              value={invoiceTypeValue}
              options={invoiceTypeOption}
              errorText=""
              onChange={handleInvoiceTypeChange}
            />

            {invoiceTypeValue === 'mobile' && (
              <OrderInputBox
                name="mobileInvoice"
                label="手機載具"
                value={formData.mobileInvoice}
                onChange={handleInputChange}
              />
            )}

            {invoiceTypeValue === 'tax' && (
              <OrderInputBox
                name="recipientTaxId"
                label="統一編號"
                value={formData.recipientTaxId}
                onChange={handleInputChange}
              />
            )}
          </div>

          <BlackBtn
            btnText="前往結帳"
            type="submit"
            href={null}
            paddingType="medium"
          />
        </div>
      </form>

      {/* RecipientModalBody */}
      <BasicModal
        modalTitle="請選擇收件人資料"
        open={isModalOpen}
        handleClose={closeModal}
        modalBody={
          <RecipientModalBody
            handleClose={closeModal}
            memberId={auth.id}
            memberAddress={memberAddress}
            fetchMemberAddress={fetchMemberAddress}
            onSelectedAddress={handleAddressSelected}
          />
        }
      />
    </section>
  )
}
