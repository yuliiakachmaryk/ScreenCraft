import React from 'react';
import styled from 'styled-components';
import { HomeScreen } from '../../types/homeScreen';
import { ContentItem } from '../../types/contentItem';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MobilePreviewModalProps {
  homeScreen: HomeScreen;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.5rem;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1;
`;

const SectionTitle = styled.h3`
  color: #fff;
  font-family: Denike;
  font-size: 1.2rem;
  margin: 1.5rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #ff6642;
`;

const SliderContainer = styled.div`
  margin-bottom: 2rem;
`;

const ContentImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const ContentTitle = styled.p`
  color: #fff;
  font-family: Denike;
  margin: 0.5rem 0;
  text-align: center;
`;

const StyledSwiper = styled(Swiper)`
  .swiper-button-next,
  .swiper-button-prev {
    color: #ff6642;
  }
  
  .swiper-pagination-bullet-active {
    background: #ff6642;
  }
`;

export const MobilePreviewModal: React.FC<MobilePreviewModalProps> = ({
  homeScreen,
  onClose,
}) => {
  const renderSlider = (items: ContentItem[], title: string) => (
    <SliderContainer>
      <SectionTitle>{title}</SectionTitle>
      <StyledSwiper
        modules={[Navigation, Pagination]}
        spaceBetween={10}
        slidesPerView={title === 'Recommendations' ? 1 : 3}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: {
            slidesPerView: title === 'Recommendations' ? 1 : 1,
            spaceBetween: 10
          },
          480: {
            slidesPerView: title === 'Recommendations' ? 1 : 2,
            spaceBetween: 10
          },
          768: {
            slidesPerView: title === 'Recommendations' ? 1 : 3,
            spaceBetween: 10
          }
        }}
      >
        {items.map((item) => (
          <SwiperSlide key={item._id}>
            <ContentImage
              src={item.introImage}
              alt={item.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/400x200?text=No+Image';
              }}
            />
            <ContentTitle>{item.name}</ContentTitle>
          </SwiperSlide>
        ))}
      </StyledSwiper>
    </SliderContainer>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {renderSlider(homeScreen.recomendaciones, 'Recommendations')}
        {renderSlider(homeScreen.topCharts, 'Top Charts')}
        {renderSlider(homeScreen.mostTrending, 'Most Trending')}
        {renderSlider(homeScreen.mostPopular, 'Most Popular')}
      </ModalContent>
    </ModalOverlay>
  );
}; 