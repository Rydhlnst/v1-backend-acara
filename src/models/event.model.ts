import mongoose, { ObjectId, Schema } from "mongoose";
import * as Yup from "yup"

const schema = mongoose.Schema;

export const eventDAO = Yup.object({
    name: Yup.string().required(),
    startDate: Yup.string().required(),
    endDate: Yup.string().required(),
    description: Yup.string().required(),
    banner: Yup.string().required(),
    isFeatured: Yup.boolean().required(),
    isOnline: Yup.boolean().required(),
    isPublished: Yup.boolean(),
    category: Yup.string().required(),
    // Berfungsi seperti ID
    slug: Yup.string(),
    createdBy: Yup.string().required(),
    createdAt: Yup.string(),
    updatedAt: Yup.string(),
    location: Yup.object().required(),
});

export type TEvent = Yup.InferType<typeof eventDAO>

// Category Mongoose
export interface Event extends Omit<TEvent, "category" | "createdBy"> {
    category: ObjectId;
    createdBy: ObjectId;
}

const EventSchema = new Schema<Event>({
    name: {
        type: Schema.Types.String,
        required: true
    },
    startDate: {
        type: Schema.Types.String,
        required: true
    },
    endDate: {
        type: Schema.Types.String,
        required: true},
    banner: {
        type: Schema.Types.String,
        required: true
    },
    // Pastikan penulisan ref sama dengan nama model category di category.model.ts
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    isOnline: {
        type: Schema.Types.Boolean,
        required: true,
    },
    isFeatured: {
        type: Schema.Types.Boolean,
        required: true,
    },
    isPublished: {
        type: Schema.Types.Boolean,
        default: false
    },
    description: {
        type: Schema.Types.String,
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    slug: {
        type: Schema.Types.String,
        unique: true
    },
    location: {
        type: {
            region: {
                type: Schema.Types.Number
            },
            coordinates: {
                type: [Schema.Types.Number],
                default: [0,0]
            }
        }
    }
}, {
    timestamps: true
});

EventSchema.pre("save", function() {
    if(!this.slug) {
        // Membuatnya menjadi unique
        const slug = this.name.split(" ").join("-").toLowerCase();
        this.slug = `${slug}`;
    }
});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;