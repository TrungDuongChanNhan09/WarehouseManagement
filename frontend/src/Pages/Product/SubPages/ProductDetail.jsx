import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, Grid2, CardMedia, Stack } from '@mui/material';
import ApiService from '../../../Service/ApiService';

export default function ProductDetail() {
  const { productId } = useParams();
  const [mainImage, setMainImage] = useState('');
  const [productInfo,setProductInfo] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const response = await ApiService.getProductById(productId);

        const updatedRows = async () => {
          try {
              const supplier = await ApiService.getSupplierById(response.supplierId);
              const category = await ApiService.getCategoryById(response.categoryId);
              setProductInfo({ 
                ...response,
                supplierName: supplier?.nameSupplier || '',
                categoryName: category?.categoryName || '',
              });
          } catch (error) {
              console.error('Lỗi khi lấy dữ liệu:', error);
              setProductInfo({ 
                ...response,
                supplierName: '',
                categoryName: '',
              });
          }
        };

        setProductInfo(updatedRows);
      } catch (error) {
        console.error('Failed to fetch product info:', error);
      }
    };
  
    fetchProductInfo();
  }, []);

  useEffect(() => {
    setMainImage(productInfo.image ?? 'https://placehold.co/600x500/png');
  }, [productInfo])

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <Button 
        variant="outlined" 
        color="#E2F1E7" 
        onClick={() => nav('/app/product/')}
        sx={{ mb: 3, fontWeight: 'bold', fontSize: '15px' }}
      >
        ← Quay lại
      </Button>
      <Grid2 container spacing={4}>
        {/* Image Section */}
        <Grid2 size={6}>
          <Box sx={{ position: 'relative', borderRadius: 2, overflow: 'hidden', mb: 2 }}>
            <CardMedia
              component="img"
              image={mainImage}
              alt="Main Product"
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Grid2>

        {/* Info Section */}
        <Grid2 size={6}>
          <Typography variant="h3" gutterBottom>
            {productInfo.productName}
          </Typography>
          <Typography variant="h4" color="error" gutterBottom>
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productInfo.price)}
          </Typography>
            <Box 
            sx={{
                maxHeight: '300px', // Chiều cao tối đa
                overflowY: 'auto', // Tạo thanh cuộn dọc khi nội dung vượt quá
                borderRadius: '8px',
                padding: '5px',
                marginBottom: '20px'
            }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {productInfo.description}
                </Typography>
            </Box>
          <Grid2 container spacing={0} sx={{marginBottom: '20px'}}>
            <Grid2 size={6}>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Loại: {productInfo.categoryName}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Nhà cung cấp: {productInfo.supplierName}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Số lượng: {productInfo.inventory_quantity} {productInfo.unit}
              </Typography>
            </Grid2>
            <Grid2 size={6}>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Ngày sản xuất: {productInfo.production_date
                  ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric',}).format(new Date(productInfo.production_date))
                  : ''}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Ngày hết hạn: {productInfo.expiration_date
                  ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric',}).format(new Date(productInfo.expiration_date))
                  : ''}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{fontSize: '18px'}}>
                Trạng thái: {productInfo.productStatus}
              </Typography>
            </Grid2>
          </Grid2>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" color="success" sx={{ width: 150 }}>
              Chỉnh Sửa
            </Button>
            <Button variant="contained" color="error" sx={{ width: 150 }}>
              Xóa
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}