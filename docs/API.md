# FlowEstate API Documentation

This document describes the REST API endpoints for FlowEstate.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, you should implement proper authentication using JWT tokens or similar.

## Endpoints

### Properties

#### GET /api/properties

Retrieve a list of properties with optional filtering and pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Number of items per page (default: 10)
- `search` (string, optional): Search term for name, description, or address
- `sortBy` (string, optional): Field to sort by (default: 'created_at')
- `sortOrder` (string, optional): Sort order - 'asc' or 'desc' (default: 'desc')
- `isListed` (boolean, optional): Filter by listing status

**Example Request:**
```bash
GET /api/properties?page=1&limit=5&search=luxury&sortBy=price&sortOrder=asc
```

**Example Response:**
```json
{
  "properties": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Downtown Luxury Condo",
      "description": "Modern 2-bedroom condo with city views",
      "address": "123 Main St, Downtown, NY 10001",
      "square_footage": 1200,
      "price": "150.50",
      "owner": "0x1234567890123456789012345678901234567890",
      "token_id": "1",
      "contract_address": "0xabcdef1234567890abcdef1234567890abcdef12",
      "image_url": "https://example.com/image.jpg",
      "is_listed": true,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 1,
    "totalPages": 1
  }
}
```

#### POST /api/properties

Create a new property.

**Request Body:**
```json
{
  "name": "Property Name",
  "description": "Property description",
  "address": "123 Main St, City, State, ZIP",
  "squareFootage": 1500,
  "price": "100.00",
  "owner": "0x1234567890123456789012345678901234567890",
  "tokenId": "1",
  "contractAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Property Name",
  "description": "Property description",
  "address": "123 Main St, City, State, ZIP",
  "square_footage": 1500,
  "price": "100.00",
  "owner": "0x1234567890123456789012345678901234567890",
  "token_id": "1",
  "contract_address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "image_url": "https://example.com/image.jpg",
  "is_listed": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/properties/[id]

Retrieve a specific property by ID.

**Path Parameters:**
- `id` (string): Property UUID

**Example Request:**
```bash
GET /api/properties/123e4567-e89b-12d3-a456-426614174000
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Downtown Luxury Condo",
  "description": "Modern 2-bedroom condo with city views",
  "address": "123 Main St, Downtown, NY 10001",
  "square_footage": 1200,
  "price": "150.50",
  "owner": "0x1234567890123456789012345678901234567890",
  "token_id": "1",
  "contract_address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "image_url": "https://example.com/image.jpg",
  "is_listed": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/properties/[id]

Update a specific property.

**Path Parameters:**
- `id` (string): Property UUID

**Request Body:**
```json
{
  "name": "Updated Property Name",
  "description": "Updated description",
  "is_listed": true,
  "price": "200.00"
}
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Updated Property Name",
  "description": "Updated description",
  "address": "123 Main St, Downtown, NY 10001",
  "square_footage": 1200,
  "price": "200.00",
  "owner": "0x1234567890123456789012345678901234567890",
  "token_id": "1",
  "contract_address": "0xabcdef1234567890abcdef1234567890abcdef12",
  "image_url": "https://example.com/image.jpg",
  "is_listed": true,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z"
}
```

#### DELETE /api/properties/[id]

Delete a specific property.

**Path Parameters:**
- `id` (string): Property UUID

**Response:**
```json
{
  "success": true
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing or invalid parameters)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently, there is no rate limiting implemented. In production, you should implement rate limiting to prevent abuse.

## CORS

The API supports CORS for cross-origin requests. In production, you should configure CORS to only allow requests from your frontend domain.

## Database Schema

The API uses the following Supabase tables:

### properties
- `id` (UUID, Primary Key)
- `name` (TEXT, NOT NULL)
- `description` (TEXT, NOT NULL)
- `address` (TEXT, NOT NULL)
- `square_footage` (INTEGER, NOT NULL)
- `price` (TEXT, NOT NULL)
- `owner` (TEXT, NOT NULL)
- `token_id` (TEXT, NULLABLE)
- `contract_address` (TEXT, NULLABLE)
- `image_url` (TEXT, NULLABLE)
- `is_listed` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### listings
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key to properties.id)
- `seller` (TEXT, NOT NULL)
- `price` (TEXT, NOT NULL)
- `is_active` (BOOLEAN, DEFAULT true)
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
- `updated_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())

### transactions
- `id` (UUID, Primary Key)
- `hash` (TEXT, UNIQUE, NOT NULL)
- `from_address` (TEXT, NOT NULL)
- `to_address` (TEXT, NOT NULL)
- `value` (TEXT, NOT NULL)
- `gas_used` (TEXT, NOT NULL)
- `status` (TEXT, CHECK constraint for 'pending', 'success', 'failed')
- `created_at` (TIMESTAMP WITH TIME ZONE, DEFAULT NOW())
