import { User } from '../models/User';
import { Address } from '../models/Address';
import { Gathering } from '../models/Gathering';
import { GatheringHistory } from '../models/GatheringHistory';
import { GatheringSubsc } from '../models/GatheringSubsc';
import { Package } from '../models/Package';
import { PackageHistory } from '../models/PackageHistory';
import { PackageSubsc } from '../models/PackageSubsc';
import { Good } from '../models/Good';
import { Book } from '../models/Book';
import { OrderHistory } from '../models/OrderHistory';
import { Notice } from '../models/Notice';
import { MonthlyCuration } from '../models/MonthlyCuration';
import { Image } from '../models/Image';
import { About } from '../models/About';
import { Place } from '../models/Place';

export const postgresTables = [
    User,
    About,
    Address,
    Gathering,
    GatheringHistory,
    GatheringSubsc,
    Package,
    PackageHistory,
    PackageSubsc,
    Good,
    Book,
    OrderHistory,
    Notice,
    MonthlyCuration,
    Image,
    Place,
];
