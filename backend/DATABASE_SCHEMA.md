# Database Schema & Relationships

## Overview

This document provides a visual representation of the database schema and relationships for the Electro project.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    USER ||--o{ REVIEW : writes
    PRODUCT ||--o{ ORDER_ITEM : "contained in"
    PRODUCT ||--o{ REVIEW : "receives"
    ORDER ||--o{ ORDER_ITEM : contains
    COUPON ||--o{ ORDER : "applied to"

    USER {
        int id PK
        string first_name
        string last_name
        string email UK
        string password
        boolean is_active
        boolean is_admin
        datetime deletion_requested_at
        datetime created_at
        string theme_preference
        string avatar
        string phone
        string address
        string city
        string postal_code
        string country
    }

    PRODUCT {
        int id PK
        string name
        text description
        string color
        string brand
        date manufacture_date
        text images
        float price
        float discount
        int stock
        int low_stock_threshold
        string category
        datetime created_at
        datetime updated_at
    }

    ORDER {
        int id PK
        int user_id FK
        string order_number UK
        string customer_first_name
        string customer_last_name
        string customer_email
        string customer_phone
        text shipping_address
        string shipping_city
        string shipping_postal_code
        string shipping_country
        string payment_method
        float total
        string status
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        string product_name
        float product_price
        int quantity
        string image
    }

    REVIEW {
        int id PK
        int product_id FK
        int user_id FK
        int rating
        string title
        text comment
        datetime created_at
    }

    SETTING {
        int id PK
        string key UK
        text value
        datetime updated_at
    }

    COUPON {
        int id PK
        string code UK
        string discount_type
        float discount_value
        float min_order_amount
        float max_discount
        int usage_limit
        int used_count
        datetime valid_from
        datetime valid_to
        boolean is_active
    }
```

## Table Descriptions

### User
Stores user account information for both regular customers and administrators.
- **Primary Key:** `id`
- **Unique Constraints:** `email`
- **Relationships:** 
  - One-to-Many with Order (places orders)
  - One-to-Many with Review (writes reviews)

### Product
Stores product inventory and details.
- **Primary Key:** `id`
- **Relationships:**
  - One-to-Many with OrderItem (items in orders)
  - One-to-Many with Review (product reviews)

### Order
Stores customer orders with shipping and payment details.
- **Primary Key:** `id`
- **Unique Constraints:** `order_number`
- **Foreign Keys:** `user_id` (nullable - allows guest orders)
- **Relationships:**
  - Many-to-One with User (belongs to customer)
  - One-to-Many with OrderItem (contains multiple items)

### OrderItem
Junction table linking Orders and Products (line items in an order).
- **Primary Key:** `id`
- **Foreign Keys:** 
  - `order_id` (references Order)
  - `product_id` (references Product)
- **Relationships:**
  - Many-to-One with Order
  - Many-to-One with Product

### Review
Stores product reviews and ratings from users.
- **Primary Key:** `id`
- **Foreign Keys:**
  - `product_id` (references Product)
  - `user_id` (references User)
- **Relationships:**
  - Many-to-One with Product
  - Many-to-One with User

### Setting
Configuration key-value pairs for application settings.
- **Primary Key:** `id`
- **Unique Constraints:** `key`
- **No Relationships:** Standalone configuration table

### Coupon
Discount coupons that can be applied to orders.
- **Primary Key:** `id`
- **Unique Constraints:** `code`
- **No Direct Relationships:** Referenced programmatically in orders

## Key Relationships

| Relationship | Type | Details |
|---|---|---|
| User → Order | 1-to-Many | User can place multiple orders (nullable user_id allows guest checkout) |
| User → Review | 1-to-Many | User can write multiple product reviews |
| Product → OrderItem | 1-to-Many | Product can appear in multiple orders |
| Product → Review | 1-to-Many | Product can have multiple reviews (with cascade delete) |
| Order → OrderItem | 1-to-Many | Order contains multiple line items |

## Cascade Behaviors

- **Review → Product:** Delete on Product deletion (cascade='all, delete-orphan')
- **OrderItem:** Foreign key constraints on both Order and Product

## Notes

- **Guest Orders:** Orders can exist without a user (user_id is nullable) for guest checkout functionality
- **Product Snapshots:** OrderItem stores product name and price at order time to maintain historical record
- **Stock Management:** Product includes `low_stock_threshold` for inventory alerts
- **Soft Deletes:** User has `deletion_requested_at` for soft delete capability
- **Timestamps:** Most tables include `created_at` and/or `updated_at` for audit trails


## Database Visualization
 - *Visit:* https://dbdiagram.io/d/GadsandGets-6a0ea215dfb20dafcdb99a10