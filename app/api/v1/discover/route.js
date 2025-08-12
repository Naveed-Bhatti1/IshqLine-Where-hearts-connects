import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await connectDB();

    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ success: false, message: 'Authorization token missing' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid token' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // decoded should have user id inside e.g. decoded.id or decoded.userId depending on your token
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid token payload' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch user from DB including location
    const user = await User.findById(userId);
    if (!user || !user.location) {
      return new Response(
        JSON.stringify({ success: false, message: 'User not found or location missing' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { searchParams } = new URL(request.url);

    const distanceParam = searchParams.get('distance');
    const ageParam = searchParams.get('age') || '18-40';
    const interestsParam = searchParams.get('interests') || '';

    const distanceKm = distanceParam ? parseInt(distanceParam) : null;
    const interestsArray = interestsParam
      ? interestsParam.split(',').map((i) => i.trim())
      : [];

    let minAge = 18,
      maxAge = 40;
    if (ageParam.includes('-')) {
      [minAge, maxAge] = ageParam.split('-').map((a) => parseInt(a));
    } else {
      minAge = maxAge = parseInt(ageParam);
    }

    const query = {
      age: { $gte: minAge, $lte: maxAge },
      _id: { $ne: user._id },
    };

    if (interestsArray.length > 0) {
      query.interests = { $in: interestsArray };
    }

    if (distanceKm) {
      query.location = {
        $nearSphere: {
          $geometry: user.location,
          $maxDistance: distanceKm * 1000,
        },
      };
    }

    const users = await User.find(query)
      .select('name age city occupation photos')
      .limit(50);

    const data = users.map((u) => ({
      _id: u._id,
      name: u.name,
      age: u.age,
      city: u.city,
      occupation: u.occupation,
      mainPicUrl: u.photos.length > 0 ? u.photos[0] : null,
    }));

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
