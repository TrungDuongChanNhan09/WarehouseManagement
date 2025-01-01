import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Select, MenuItem, Grid2, CardMedia, Stack } from '@mui/material';
import ApiService from '../../../Service/ApiService';

export default function ProductDetail() {
  const { productId } = useParams();
  const [mainImage, setMainImage] = useState('');
  const [productInfo,setProductInfo] = useState([]);

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        setProductInfo(await ApiService.getProductById(productId));
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
      <Grid2 container spacing={4} >
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
          <Typography variant="h4" gutterBottom>
            {productInfo.productName}
          </Typography>
          <Typography variant="h5" color="error" gutterBottom>
            {productInfo.price}
          </Typography>
            <Box 
            sx={{
                maxHeight: '300px', // Chiều cao tối đa
                overflowY: 'auto', // Tạo thanh cuộn dọc khi nội dung vượt quá
                borderRadius: '8px',
                padding: '5px',
                marginBottom: '20px'
            }}>
                <Typography variant="body1">
                    Từ thương hiệu loại nước ngọt giải khát được nhiều người yêu thích với hương vị thơm ngon, sảng khoái. 
                    6 lon nước ngọt Coca Cola lon 235ml chính hãng nước ngọt Coca Cola với lượng gas lớn sẽ giúp bạn xua tan 
                    mọi cảm giác mệt mỏi, căng thẳng, đem lại cảm giác thoải mái sau khi hoạt động ngoài trời.
                </Typography>
                <Typography variant="body1">
                    Đôi nét về thương hiệu Coca Cola:
                </Typography>
                <Typography variant="body1">
                    Coca Cola là thương hiệu nước ngọt nổi tiếng thế giới, được ra đời tại Mỹ năm 1886 và nhanh chóng phát 
                    triển thành tập đoàn đa quốc gia hùng mạnh trên thị trường nước ngọt thế giới. Hiện nay Coca Cola đã 
                    có mặt và được yêu thích tại hơn 200 quốc gia trên thế giới với hương vị nước cola chua chua ngọt ngọt 
                    hài hòa, vị ga sảng khoái cùng hương thơm dễ chịu.
                </Typography>
                <Typography variant="body1">
                    Ngoài dòng Coca Original, thương hiệu này còn phát triển nhiều dòng sản phẩm mới phù hợp với nhu cầu và 
                    mối quan tâm về sức khỏe, cân nặng của người dùng bằng các sản phẩm ít đường ít calo hơn như Coca Zero, 
                    Coca Light, Coca Plus,...
                </Typography>
            </Box>
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