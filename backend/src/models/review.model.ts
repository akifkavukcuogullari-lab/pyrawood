import { query } from '../config/database';
import { parsePagination } from '../utils/pagination';

// ── Row interfaces (snake_case from DB) ──────────────────────────────

interface ReviewRow {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: Date;
  // Joined user fields
  user_name?: string;
  user_avatar_url?: string | null;
}

// ── Mapped interface (camelCase for API) ─────────────────────────────

export interface MappedReview {
  id: string;
  productId: string;
  userId: string;
  user?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  rating: number;
  title?: string;
  body?: string;
  createdAt: string;
}

// ── Mapper ───────────────────────────────────────────────────────────

function mapToReview(row: ReviewRow): MappedReview {
  const review: MappedReview = {
    id: row.id,
    productId: row.product_id,
    userId: row.user_id,
    rating: row.rating,
    title: row.title || undefined,
    body: row.body || undefined,
    createdAt: row.created_at.toISOString(),
  };

  if (row.user_name) {
    review.user = {
      id: row.user_id,
      name: row.user_name,
      avatarUrl: row.user_avatar_url || undefined,
    };
  }

  return review;
}

// ── Model ────────────────────────────────────────────────────────────

export const ReviewModel = {
  /**
   * Find all reviews for a product with user info, ordered by created_at DESC.
   */
  async findByProductId(
    productId: string,
    pagination: { page?: number; limit?: number }
  ): Promise<{ reviews: MappedReview[]; total: number }> {
    const { page, limit, offset } = parsePagination({
      page: pagination.page,
      limit: pagination.limit,
    });

    const countResult = await query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM reviews WHERE product_id = $1',
      [productId]
    );
    const total = parseInt(countResult.rows[0].total, 10);

    const reviewsResult = await query<ReviewRow>(
      `SELECT r.id, r.product_id, r.user_id, r.rating, r.title, r.body, r.created_at,
              u.name AS user_name, u.avatar_url AS user_avatar_url
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.product_id = $1
       ORDER BY r.created_at DESC
       LIMIT $2 OFFSET $3`,
      [productId, limit, offset]
    );

    const reviews = reviewsResult.rows.map(mapToReview);

    return { reviews, total };
  },

  /**
   * Create a new review and return it with user info.
   */
  async create(
    productId: string,
    userId: string,
    data: { rating: number; title?: string; body?: string }
  ): Promise<MappedReview> {
    const { rows } = await query<ReviewRow>(
      `INSERT INTO reviews (product_id, user_id, rating, title, body)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, product_id, user_id, rating, title, body, created_at`,
      [productId, userId, data.rating, data.title || null, data.body || null]
    );

    // Fetch user info for the response
    const userResult = await query<{ name: string; avatar_url: string | null }>(
      'SELECT name, avatar_url FROM users WHERE id = $1',
      [userId]
    );

    const review = mapToReview(rows[0]);
    if (userResult.rows[0]) {
      review.user = {
        id: userId,
        name: userResult.rows[0].name,
        avatarUrl: userResult.rows[0].avatar_url || undefined,
      };
    }

    return review;
  },

  /**
   * Check if a user has already reviewed a specific product.
   */
  async findByUserAndProduct(
    userId: string,
    productId: string
  ): Promise<MappedReview | null> {
    const { rows } = await query<ReviewRow>(
      `SELECT id, product_id, user_id, rating, title, body, created_at
       FROM reviews
       WHERE user_id = $1 AND product_id = $2`,
      [userId, productId]
    );

    return rows[0] ? mapToReview(rows[0]) : null;
  },
};
