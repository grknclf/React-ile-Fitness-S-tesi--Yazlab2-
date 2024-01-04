import '../../App.css';
import { Box } from '@mui/material'
import { useState } from 'react';
import React, { useEffect } from 'react';

function RandomImage() {
	const [imageUrl, setImageUrl] = useState('');

	useEffect(() => {
	  // Her render'da URL'i güncelle
	  const uniqueId = Date.now(); // Şimdiki zamanı milisaniye cinsinden kullan
	  setImageUrl(`https://source.unsplash.com/random?fitness&${uniqueId}`);
	}, []); // Boş dizi, bu effect'in bileşen her render edildiğinde değil, sadece ilk yüklendiğinde çalışmasını sağlar

	return (
	  <Box
		sx={{
		  width: '100%', // veya ihtiyacınıza göre bir değer
		  height: '100vh',
		  backgroundImage: `url(${imageUrl})`,
		  backgroundSize: 'cover', // Resmin kutuya sığdığından emin ol
		  backgroundPosition: 'center' // Resmin merkezde olmasını sağla
		}}
	  />
	);
}

export default RandomImage;
