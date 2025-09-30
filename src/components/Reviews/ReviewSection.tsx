import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Avatar,
  Icon,
  Progress,
  Select,
  Textarea,
  useToast,
  useDisclosure,
  Tag,
  TagLabel,
  TagLeftIcon,
  Divider,
  SimpleGrid,
  Image,
  IconButton,
} from '@chakra-ui/react';
import {
  FaStar,
  FaRegStar,
  FaThumbsUp,
  FaCheck,
  FaPlus,
  FaMinus,
  FaCamera,
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { Review } from '@/app/api/reviews/route';

interface ReviewSectionProps {
  targetType: 'property' | 'agent';
  targetId: string;
  targetName: string;
}

interface ReviewSummary {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  verifiedBuyerCount: number;
}

interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  images: string[];
}

const StarRating: React.FC<{
  rating: number;
  onChange?: (rating: number) => void;
  size?: number;
  isInteractive?: boolean;
}> = ({ rating, onChange, size = 5, isInteractive = true }) => (
  <HStack spacing={1}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Icon
        key={i}
        as={i < rating ? FaStar : FaRegStar}
        color={i < rating ? 'yellow.400' : 'gray.300'}
        boxSize={size}
        cursor={isInteractive ? 'pointer' : 'default'}
        onClick={() => isInteractive && onChange?.(i + 1)}
      />
    ))}
  </HStack>
);

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  targetType,
  targetId,
  targetName,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [summary, setSummary] = useState<ReviewSummary | null>(null);
  const [sortBy, setSortBy] = useState<string>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 0,
    title: '',
    content: '',
    pros: [],
    cons: [],
    images: [],
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews?targetType=${targetType}&targetId=${targetId}&sortBy=${sortBy}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data.reviews);
        setSummary(data.summary);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load reviews',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [targetType, targetId, sortBy, toast]);

  const handleSubmitReview = async () => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType,
          targetId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit review');
      }

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);

      toast({
        title: 'Success',
        description: 'Review submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      setFormData({
        rating: 0,
        title: '',
        content: '',
        pros: [],
        cons: [],
        images: [],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleHelpfulVote = async (reviewId: string) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reviewId,
          action: 'helpful',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update helpful count');
      }

      const data = await response.json();
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? { ...review, helpfulCount: data.helpfulCount }
            : review
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update helpful count',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // In a real app, upload to cloud storage and get URLs
    const imageUrls = files.map(
      (file) => URL.createObjectURL(file)
    );
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...imageUrls],
    }));
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading reviews...
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Summary Section */}
        <Box bg="white" p={6} borderRadius="lg" boxShadow="sm">
          <HStack spacing={8} align="start">
            <VStack align="start" flex={1}>
              <Text fontSize="3xl" fontWeight="bold">
                {summary?.averageRating.toFixed(1)}
              </Text>
              <StarRating
                rating={Math.round(summary?.averageRating || 0)}
                isInteractive={false}
                size={4}
              />
              <Text color="gray.600">
                Based on {summary?.totalReviews} reviews
              </Text>
              {summary?.verifiedBuyerCount > 0 && (
                <Tag colorScheme="green" size="sm">
                  <TagLeftIcon as={FaCheck} />
                  <TagLabel>
                    {summary.verifiedBuyerCount} verified buyers
                  </TagLabel>
                </Tag>
              )}
            </VStack>

            <VStack flex={2} spacing={2} align="stretch">
              {summary?.ratingDistribution
                .slice()
                .reverse()
                .map((dist) => (
                  <HStack key={dist.rating} spacing={4}>
                    <Text width="80px">{dist.rating} stars</Text>
                    <Progress
                      value={(dist.count / summary.totalReviews) * 100}
                      size="sm"
                      flex={1}
                      colorScheme="yellow"
                    />
                    <Text width="60px" textAlign="right">
                      {dist.count}
                    </Text>
                  </HStack>
                ))}
            </VStack>
          </HStack>

          <HStack mt={6} justify="space-between">
            <Button
              colorScheme="blue"
              leftIcon={<FaStar />}
              onClick={onOpen}
            >
              Write a Review
            </Button>

            <Select
              width="200px"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="helpful">Most Helpful</option>
              <option value="rating-high">Highest Rated</option>
              <option value="rating-low">Lowest Rated</option>
            </Select>
          </HStack>
        </Box>

        {/* Reviews List */}
        <VStack spacing={4} align="stretch">
          {reviews.map((review) => (
            <Box
              key={review.id}
              bg="white"
              p={6}
              borderRadius="lg"
              boxShadow="sm"
            >
              <HStack justify="space-between" mb={4}>
                <HStack>
                  <Avatar
                    size="sm"
                    name={review.userName}
                    src={review.userImage}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="bold">{review.userName}</Text>
                    <Text fontSize="sm" color="gray.600">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>
                  {review.isVerifiedBuyer && (
                    <Tag colorScheme="green" size="sm">
                      <TagLeftIcon as={FaCheck} />
                      <TagLabel>Verified Buyer</TagLabel>
                    </Tag>
                  )}
                </HStack>
                <StarRating
                  rating={review.rating}
                  isInteractive={false}
                  size={4}
                />
              </HStack>

              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {review.title}
              </Text>
              <Text mb={4}>{review.content}</Text>

              {(review.pros.length > 0 || review.cons.length > 0) && (
                <VStack align="start" spacing={2} mb={4}>
                  {review.pros.length > 0 && (
                    <HStack>
                      <Icon as={FaPlus} color="green.500" />
                      <Text>
                        <Text as="span" fontWeight="bold">
                          Pros:{' '}
                        </Text>
                        {review.pros.join(', ')}
                      </Text>
                    </HStack>
                  )}
                  {review.cons.length > 0 && (
                    <HStack>
                      <Icon as={FaMinus} color="red.500" />
                      <Text>
                        <Text as="span" fontWeight="bold">
                          Cons:{' '}
                        </Text>
                        {review.cons.join(', ')}
                      </Text>
                    </HStack>
                  )}
                </VStack>
              )}

              {review.images.length > 0 && (
                <SimpleGrid columns={4} spacing={2} mb={4}>
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      borderRadius="md"
                      objectFit="cover"
                      height="100px"
                    />
                  ))}
                </SimpleGrid>
              )}

              <HStack>
                <Button
                  size="sm"
                  leftIcon={<FaThumbsUp />}
                  variant="ghost"
                  onClick={() => handleHelpfulVote(review.id)}
                >
                  Helpful ({review.helpfulCount})
                </Button>
              </HStack>
            </Box>
          ))}
        </VStack>
      </VStack>

      {/* Review Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Write a Review for {targetName}</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Rating</FormLabel>
                <StarRating
                  rating={formData.rating}
                  onChange={(rating) =>
                    setFormData((prev) => ({ ...prev, rating }))
                  }
                  size={6}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Summarize your experience"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Review</FormLabel>
                <Textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, content: e.target.value }))
                  }
                  placeholder="Share your experience in detail"
                  rows={4}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Pros (Optional)</FormLabel>
                <Input
                  placeholder="Add pros (comma separated)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const pros = input.value
                        .split(',')
                        .map((p) => p.trim())
                        .filter(Boolean);
                      setFormData((prev) => ({
                        ...prev,
                        pros: [...prev.pros, ...pros],
                      }));
                      input.value = '';
                    }
                  }}
                />
                {formData.pros.length > 0 && (
                  <Box mt={2}>
                    {formData.pros.map((pro, index) => (
                      <Tag
                        key={index}
                        m={1}
                        colorScheme="green"
                        onDoubleClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            pros: prev.pros.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        {pro}
                      </Tag>
                    ))}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Cons (Optional)</FormLabel>
                <Input
                  placeholder="Add cons (comma separated)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const input = e.currentTarget;
                      const cons = input.value
                        .split(',')
                        .map((c) => c.trim())
                        .filter(Boolean);
                      setFormData((prev) => ({
                        ...prev,
                        cons: [...prev.cons, ...cons],
                      }));
                      input.value = '';
                    }
                  }}
                />
                {formData.cons.length > 0 && (
                  <Box mt={2}>
                    {formData.cons.map((con, index) => (
                      <Tag
                        key={index}
                        m={1}
                        colorScheme="red"
                        onDoubleClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            cons: prev.cons.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        {con}
                      </Tag>
                    ))}
                  </Box>
                )}
              </FormControl>

              <FormControl>
                <FormLabel>Images (Optional)</FormLabel>
                <HStack>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    display="none"
                    id="image-upload"
                    onChange={handleImageUpload}
                  />
                  <Button
                    as="label"
                    htmlFor="image-upload"
                    leftIcon={<FaCamera />}
                  >
                    Add Images
                  </Button>
                </HStack>
                {formData.images.length > 0 && (
                  <SimpleGrid columns={4} spacing={2} mt={2}>
                    {formData.images.map((image, index) => (
                      <Box key={index} position="relative">
                        <Image
                          src={image}
                          alt={`Upload preview ${index + 1}`}
                          borderRadius="md"
                          objectFit="cover"
                          height="100px"
                        />
                        <IconButton
                          aria-label="Remove image"
                          icon={<FaMinus />}
                          size="xs"
                          position="absolute"
                          top={1}
                          right={1}
                          colorScheme="red"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }))
                          }
                        />
                      </Box>
                    ))}
                  </SimpleGrid>
                )}
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmitReview}
              isDisabled={!formData.rating || !formData.title || !formData.content}
            >
              Submit Review
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
