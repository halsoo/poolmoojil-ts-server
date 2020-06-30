import { getManager, getConnection, Repository, Between } from 'typeorm';

import { Place } from '../models/Place';
import { Image } from '../models/Image';

import moment from 'moment';
import 'moment/locale/ko';

export default class PlaceController {
    public static async getPlaces(ctx: any, next: any) {
        try {
            const places = await getConnection()
                .createQueryBuilder()
                .select('places')
                .from(Place, 'places')
                .leftJoinAndSelect('places.mainImg', 'images')
                .orderBy('places.id', 'DESC')
                .getMany();

            ctx.body = places;
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async deletePlace(ctx: any, next: any) {
        try {
            const placeRepository: Repository<Place> = getManager().getRepository(Place);
            const place: Place | undefined = await placeRepository.findOne({
                join: {
                    alias: 'place',
                    leftJoinAndSelect: {
                        mainImg: 'place.mainImg',
                    },
                },
                where: { id: ctx.params.id },
            });

            if (place) {
                await placeRepository.remove(place);
                ctx.status = 204;
            } else {
                ctx.status = 400;
                ctx.body = "The place you are trying to delete doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async getPlaceID(ctx: any, next: any) {
        try {
            const placeRepository: Repository<Place> = getManager().getRepository(Place);
            const place: Place | undefined = await placeRepository.findOne({
                join: {
                    alias: 'place',
                    leftJoinAndSelect: {
                        mainImg: 'place.mainImg',
                    },
                },
                where: { id: ctx.params.id },
            });

            console.log(place);

            if (place) {
                ctx.status = 200;
                ctx.body = place;
            } else {
                ctx.status = 400;
                ctx.body = "The place you are trying to find doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async createPlace(ctx: any, next: any) {
        try {
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const placeRepository: Repository<Place> = getManager().getRepository(Place);

            const place = new Place();

            const req = ctx.request.body;

            if (req.name) place.name = req.name;
            if (req.address) place.address = req.address;
            if (req.subAddress) place.subAddress = req.subAddress;
            if (req.weekday) place.weekday = req.weekday;
            if (req.weekdayOpen) place.weekdayOpen = req.weekdayOpen;
            if (req.weekdayClose) place.weekdayClose = req.weekdayClose;
            if (req.shortday) place.shortday = req.shortday;
            if (req.shortdayOpen) place.shortdayOpen = req.shortdayOpen;
            if (req.shortdayClose) place.shortdayClose = req.shortdayClose;
            if (req.closing) place.closing = req.closing;
            if (req.phone) place.phone = req.phone;
            if (req.fax) place.fax = req.fax;
            if (req.insta) place.insta = req.insta;
            if (req.email) place.email = req.email;
            if (req.mainImg) {
                const newImage = new Image();
                newImage.link = req.mainImg;
                newImage.name = req.mainImg.substring(65);

                const image = await imageRepository.save(newImage);

                place.mainImg = image;
            }

            const newPlace = placeRepository.save(place);

            if (newPlace) {
                ctx.status = 200;
            } else {
                ctx.status = 500;
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }

    public static async updatePlace(ctx: any, next: any) {
        try {
            const imageRepository: Repository<Image> = getManager().getRepository(Image);
            const placeRepository: Repository<Place> = getManager().getRepository(Place);
            const place: Place | any = await placeRepository.findOne({
                join: {
                    alias: 'place',
                    leftJoinAndSelect: {
                        mainImg: 'place.mainImg',
                    },
                },
                where: { id: ctx.request.body.id },
            });

            const req = ctx.request.body;

            if (place) {
                if (req.name) place.name = req.name;
                if (req.address) place.address = req.address;

                if (req.subAddress) place.subAddress = req.subAddress;
                else place.subAddress = null;

                if (req.weekday) place.weekday = req.weekday;
                else place.weekday = null;

                if (req.weekdayOpen) place.weekdayOpen = req.weekdayOpen;
                else place.weekdayOpen = null;

                if (req.weekdayClose) place.weekdayClose = req.weekdayClose;
                else place.weekdayClose = null;

                if (req.shortday) place.shortday = req.shortday;
                else place.shortday = null;

                if (req.shortdayOpen) place.shortdayOpen = req.shortdayOpen;
                else place.shortdayOpen = null;

                if (req.shortdayClose) place.shortdayClose = req.shortdayClose;
                else place.shortdayClose = null;

                if (req.closing) place.closing = req.closing;
                else place.closing = null;

                if (req.phone) place.phone = req.phone;
                else place.phone = null;

                if (req.fax) place.fax = req.fax;
                else place.fax = null;

                if (req.insta) place.insta = req.insta;
                else place.insta = null;

                if (req.email) place.email = req.email;
                else place.email = null;

                if (req.mainImg) {
                    if (place.mainImg) {
                        const oldImage: Image | any = await imageRepository.findOne({
                            where: { id: place.mainImg.id },
                        });

                        await imageRepository.remove(oldImage);
                    }

                    const newImage = new Image();
                    newImage.link = req.mainImg;
                    newImage.name = req.mainImg.substring(65);

                    const image = await imageRepository.save(newImage);

                    place.mainImg = image;
                }

                const savedPlace = placeRepository.save(place);

                if (savedPlace) {
                    ctx.status = 200;
                } else {
                    ctx.status = 500;
                }
            } else {
                ctx.status = 400;
                ctx.body = "The place you are trying to edit doesn't exist in the db";
            }
        } catch (err) {
            ctx.status = err.statusCode || err.status || 500;
            ctx.body = {
                message: err.message,
            };
        }
        await next();
    }
}
