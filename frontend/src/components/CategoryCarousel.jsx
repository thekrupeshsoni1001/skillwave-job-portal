//CategoryCarousel.jsx

import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Construction",
    "Manufacturing",
    "Maintenance",
    "Retail",
    "Agriculture",
    "Warehouse",
    "Food Service",
    "Cleaning Services",
    "Landscaping"
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    };

    return (
        <div className="mx-auto my-20 max-w-xl">
            <Carousel className="w-full">
                <CarouselContent className="flex justify-between space-x-2"> {/* Add space-x-2 to reduce gap */}
                    {category.map((cat, index) => (
                        <CarouselItem key={index} className="basis-1/3"> {/* Adjust basis to reduce item width */}
                            <Button onClick={() => searchJobHandler(cat)} variant="outline" className="w-full rounded-full">
                                {cat}
                            </Button>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
};

export default CategoryCarousel;
