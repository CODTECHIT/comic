import { z } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues.map((e) => ({ path: e.path.join("."), message: e.message })),
      });
    }
    next(error);
  }
};

// ── Auth schemas ─────────────────────────────────────────────────────────────
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username min 3 chars").max(30, "Username max 30 chars")
      .regex(/^[a-zA-Z0-9_]+$/, "Username: only letters, numbers, underscores"),
    email: z.string().email("Invalid email").max(100, "Email too long"),
    password: z.string().min(8, "Password min 8 chars").max(128, "Password too long"),
    mobile: z.string().min(10, "Mobile min 10 digits").max(15, "Mobile max 15 digits")
      .regex(/^[0-9+\-\s()]+$/, "Invalid mobile number").optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").max(100, "Email too long"),
    password: z.string().min(1, "Password required").max(128, "Password too long"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").max(100, "Email too long"),
  }),
});

export const otpSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").max(100, "Email too long"),
    otp: z.string().length(6, "OTP must be exactly 6 digits").regex(/^\d{6}$/, "OTP must be 6 digits"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email").max(100, "Email too long"),
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d{6}$/, "OTP digits only"),
    newPassword: z.string().min(8, "Password min 8 chars").max(128, "Password too long"),
  }),
});

// ── Comment schemas ───────────────────────────────────────────────────────────
export const createCommentSchema = z.object({
  body: z.object({
    comicId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid comic ID").optional(),
    text: z.string().min(1, "Comment required").max(1000, "Comment max 1000 chars"),
    rating: z.number().int().min(1).max(5).optional(),
  }),
});

export const updateCommentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "hidden"], { errorMap: () => ({ message: "Status must be 'approved' or 'hidden'" }) }),
  }),
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid comment ID"),
  }),
});

// ── Comic schemas ─────────────────────────────────────────────────────────────
export const createComicSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title required").max(200, "Title max 200 chars"),
    description: z.string().max(5000, "Description max 5000 chars").optional(),
    price: z.number().min(0, "Price cannot be negative").max(100000, "Price too high"),
    img: z.string().url("Invalid image URL").optional(),
    pages: z.array(z.string().url("Invalid page URL")).optional(),
    category: z.string().max(100).optional(),
    author: z.string().max(100).optional(),
  }),
});

// ── Email schema ──────────────────────────────────────────────────────────────
export const sendEmailSchema = z.object({
  body: z.object({
    to: z.string().email("Invalid recipient email").max(100),
    subject: z.string().min(1).max(200, "Subject max 200 chars"),
    html: z.string().min(1).max(50000, "Email body too large"),
  }),
});

// ── Order schemas ─────────────────────────────────────────────────────────────
export const createOrderSchema = z.object({
  body: z.object({
    comicIds: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid comic ID")).max(50, "Max 50 comics per order").optional(),
    planName: z.string().max(100).optional(),
    currency: z.string().length(3, "Currency must be 3-letter code (e.g. INR)").optional(),
  }),
});

export const verifyOrderSchema = z.object({
  body: z.object({
    razorpay_order_id: z.string().min(1).max(100),
    razorpay_payment_id: z.string().min(1).max(100),
    razorpay_signature: z.string().min(1).max(200),
    comicIds: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid comic ID")).max(50).optional(),
    planName: z.string().max(100).optional(),
  }),
});

// ── Generic ID param ──────────────────────────────────────────────────────────
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ID"),
  }),
});

// ── Subscription / Category / HeroSlide ──────────────────────────────────────
export const subscriptionSchema = z.object({
  body: z.object({
    price: z.number().positive("Price must be greater than zero").max(100000),
    description: z.string().max(1000).optional(),
    features: z.array(z.string()).optional(),
    is_active: z.boolean().optional(),
    is_popular: z.boolean().optional(),
    display_order: z.number().int().optional(),
  }),
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100),
  }),
});

export const heroSlideSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200),
    tagline: z.string().min(1, "Tagline is required").max(200),
    genre: z.string().min(1, "Genre is required").max(100),
    price: z.number().min(0, "Price cannot be negative"),
    badge: z.string().optional(),
    accentColor: z.string().optional(),
    img: z.string().url("Invalid image URL"),
  }),
});

export const adBannerSchema = z.object({
  body: z.object({
    imageUrl: z.string().url("Invalid image URL"),
    linkUrl: z.string().url("Invalid link URL").or(z.literal("")).optional(),
    isActive: z.boolean().optional(),
  }),
});

// ── Contact schema ────────────────────────────────────────────────────────────
export const contactFormSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email").max(100, "Email too long"),
    subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
    message: z.string().min(10, "Message must be at least 10 characters").max(5000, "Message too long"),
  }),
});
