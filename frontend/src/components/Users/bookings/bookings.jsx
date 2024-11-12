import React, {useState, useEffect} from 'react';
import {
    getBookedItineraries,
    cancleItineraryBooking,
    addRatingToItinerary,
    addCommentToItinerary
} from '../../../api/itinerary.ts';
import {
    cancleActivityBooking,
    getBookedActivities,
    addCommentToActivity,
    addRatingToActivity
} from '../../../api/activity.ts';
import {rateTourGuide, commentOnTourGuide} from '../../../api/tourGuide.ts';
import {Card, Tag, Button, Space, Select, message, Avatar, Typography} from 'antd';
import {getCurrency, submitFeedback} from '../../../api/account.ts'; // Import submitFeedback API function
import {LikeOutlined, UserOutlined} from '@ant-design/icons';
import FeedbackForm from '../../shared/FeedBackForm/FeedbackForm.jsx';

const {Text} = Typography;
const {Option} = Select;

const BookingGrid = () => {
    const [bookedActivities, setBookedActivities] = useState([]);
    const [bookedItineraries, setBookedItineraries] = useState([]);
    const [activityStatus, setActivityStatus] = useState('All');
    const [itineraryStatus, setItineraryStatus] = useState('All');
    const [selectedType, setSelectedType] = useState('activities'); // To toggle between activities and itineraries
    const [currency, setCurrency] = useState(null);
    const [feedbackVisibility, setFeedbackVisibility] = useState({}); // To track visibility of feedback forms

    useEffect(() => {
        fetchCurrency();
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const activities = await getBookedActivities();
            setBookedActivities(activities.data);
        } catch (error) {
            message.error(error.response.data.message);
        }
        try {
            const itineraries = await getBookedItineraries();
            setBookedItineraries(itineraries);
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const fetchCurrency = async () => {
        try {
            const response = await getCurrency();
            setCurrency(response.data);
        } catch (err) {
            message.error(err.response.data.message);
        }
    };

    const submitTourGuideRateAndReview = async (tourGuideId, feedback) => {
        try {
            await rateTourGuide(tourGuideId, feedback.rating);
            await commentOnTourGuide(tourGuideId, feedback.comment);
            message.success('Tour guide feedback submitted successfully');
        } catch (error) {
            console.log("here", error);
            message.error(error.response.data.message);
        }
    };

    const submitItineraryRateAndReview = async (itineraryId, feedback) => {
        try {
            await addRatingToItinerary(itineraryId, feedback.rating);
            await addCommentToItinerary(itineraryId, feedback.comment);
            message.success('Itinerary feedback submitted successfully');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const submitActivityRateAndReview = async (activityId, feedback) => {
        try {
            await addRatingToActivity(activityId, feedback.rating);
            await addCommentToActivity(activityId, feedback.comment);
            message.success('Activity feedback submitted successfully');
        } catch (error) {
            message.error(error.response.data.message);
        }
    };

    const renderStatusTag = (status) => {
        switch (status) {
            case 'Pending':
                return <Tag color="orange">Pending</Tag>;
            case 'Completed':
                return <Tag color="green">Completed</Tag>;
            case 'Cancelled':
                return <Tag color="red">Cancelled</Tag>;
            default:
                return null;
        }
    };

    const cancelBooking = async (id, type) => {
        try {
            const response = type === 'activity'
                ? await cancleActivityBooking(id)
                : await cancleItineraryBooking(id);
            message.success(response.data.message);
            fetchBookings();
        } catch (err) {
            message.error(err.response.data.message);
        }
    };

    const toggleFeedbackVisibility = (id, type) => {
        setFeedbackVisibility((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [type]: !prev[id]?.[type],
            },
        }));
    };

    return (
        <div className="p-6">
            <Space className="mb-6">
                <Select value={selectedType} onChange={setSelectedType} style={{width: 200}}>
                    <Option value="activities">Activities</Option>
                    <Option value="itineraries">Itineraries</Option>
                </Select>

                {selectedType === 'activities' && (
                    <Select value={activityStatus} onChange={setActivityStatus} style={{width: 200}}>
                        <Option value="All">All Activities</Option>
                        <Option value="Pending">Pending Activities</Option>
                        <Option value="Completed">Completed Activities</Option>
                        <Option value="Cancelled">Cancelled Activities</Option>
                    </Select>
                )}

                {selectedType === 'itineraries' && (
                    <Select value={itineraryStatus} onChange={setItineraryStatus} style={{width: 200}}>
                        <Option value="All">All Itineraries</Option>
                        <Option value="Pending">Pending Itineraries</Option>
                        <Option value="Completed">Completed Itineraries</Option>
                        <Option value="Cancelled">Cancelled Itineraries</Option>
                    </Select>
                )}
            </Space>

            {selectedType === 'itineraries' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {bookedItineraries.map((itinerary) => (
                        itinerary.itinerary ? (
                            <Card key={itinerary._id} title={itinerary.itinerary.name} className="shadow-lg p-4"
                                  hoverable>
                                <div className="flex justify-between items-center mb-4">
                                    <span>{new Date(itinerary.date).toLocaleDateString()}</span>
                                    {renderStatusTag(itinerary.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Booking By: {itinerary.createdBy.username}</p>
                                    <p>Price: {currency?.code} {(currency?.rate * itinerary.itinerary.price).toFixed(2)}</p>
                                </div>
                                {itinerary.status === 'Pending' && (
                                    <Button type="primary" danger
                                            onClick={() => cancelBooking(itinerary._id, 'itinerary')}>
                                        Cancel Booking
                                    </Button>
                                )}

                                <Button
                                    className="mt-4"
                                    onClick={() => toggleFeedbackVisibility(itinerary._id, 'tourGuide')}
                                >
                                    {feedbackVisibility[itinerary._id]?.tourGuide ? 'Hide Tour Guide Feedback' : 'Give Tour Guide Feedback'}
                                </Button>
                                <Button
                                    className="mt-4"
                                    onClick={() => toggleFeedbackVisibility(itinerary._id, 'itinerary')}
                                >
                                    {feedbackVisibility[itinerary._id]?.itinerary ? 'Hide Itinerary Feedback' : 'Give Itinerary Feedback'}
                                </Button>

                                {feedbackVisibility[itinerary._id]?.tourGuide && (
                                    <FeedbackForm
                                        entity={{
                                            name: itinerary.itinerary.createdBy.username,
                                            _id: itinerary.itinerary.createdBy._id
                                        }}
                                        onSubmit={(feedback) => submitTourGuideRateAndReview(itinerary.itinerary.createdBy._id, feedback)}
                                    />
                                )}

                                {feedbackVisibility[itinerary._id]?.itinerary && (
                                    <FeedbackForm
                                        entity={{name: itinerary.itinerary.name, _id: itinerary.itinerary._id}}
                                        onSubmit={(feedback) => submitItineraryRateAndReview(itinerary.itinerary._id, feedback)}
                                    />
                                )}
                            </Card>
                        ) : null // Render nothing if itinerary.itinerary is null
                    ))}
                </div>
            )}


            {selectedType === 'activities' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {bookedActivities.map((activity) => (
                        activity.activity ? (
                            <Card key={activity._id} title={activity.activity.name} className="shadow-lg p-4" hoverable>
                                <div className="flex justify-between items-center mb-4">
                                    <span>{new Date(activity.date).toLocaleDateString()}</span>
                                    {renderStatusTag(activity.status)}
                                </div>
                                <div className="text-sm text-gray-600">
                                    <p>Booking By: {activity.createdBy.username}</p>
                                    <p>Location: {activity.activity.location.lat}, {activity.activity.location.lng}</p>
                                    <p>Price: {currency?.code} {(currency?.rate * activity.activity.price.min).toFixed(2)}</p>
                                </div>
                                {activity.status === 'Pending' && (
                                    <Button type="primary" danger
                                            onClick={() => cancelBooking(activity._id, 'activity')}>
                                        Cancel Booking
                                    </Button>
                                )}

                                <Button
                                    className="mt-4"
                                    onClick={() => toggleFeedbackVisibility(activity._id, 'activity')}
                                >
                                    {feedbackVisibility[activity._id]?.activity ? 'Hide Activity Feedback' : 'Give Activity Feedback'}
                                </Button>

                                {feedbackVisibility[activity._id]?.activity && (
                                    <FeedbackForm
                                        entity={{name: activity.activity.name, _id: activity.activity._id}}
                                        onSubmit={(feedback) => submitActivityRateAndReview(activity.activity._id, feedback)}
                                    />
                                )}
                            </Card>
                        ) : null // Render nothing if activity.activity is null
                    ))}
                </div>
            )}

        </div>
    );
};

export default BookingGrid;