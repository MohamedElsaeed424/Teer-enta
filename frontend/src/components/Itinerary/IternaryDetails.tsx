import React, { useEffect, useState } from "react";
import { MapPin, Clock, Calendar } from "lucide-react";

import {
  Card,
  Typography,
  Tag,
  Space,
  List,
  Rate,
  Timeline,
  Avatar,
  Row,
  Col,
  message,
  Button,
} from "antd";
import {
  ArrowRightOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  GlobalOutlined,
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CopyOutlined,
  MailOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getIternary } from "../../api/itinerary.ts";
import { TItinerary } from "../../types/Itinerary/Itinerary";
import { getCommentsForTourGuide } from "../../api/tourGuide.ts";
import BackButton from "../shared/BackButton/BackButton.js";

const { Title, Text } = Typography;

const ItineraryDetails: React.FC = () => {
  const { id: itineraryId } = useParams<{ id: string }>();
  const [itinerary, setItinerary] = useState<TItinerary>();
  const [tourGuide, setTourGuide] = useState();
  const navigate = useNavigate();
  const [tourGuideComments, setTourGuideComments] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle =
    "bg-white shadow-xl rounded-lg w-full h-full overflow-hidden";
  const gradientBg = "bg-slate-400";
  const titleStyle =
    "text-lg font-semibold mb-4 flex items-center gap-2 text-first";
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    getIternary(itineraryId)
      .then((res) => {
        setItinerary(res.data.itinerary);
        setTourGuide(res.data.tourGuide);
        fetchTourGuideComments(res.data.itinerary.createdBy);
      })
      .catch((error) => {
        message.error("Failed to fetch itinerary details");
      });
  }, [itineraryId]);

  const fetchTourGuideComments = async (tourGuideId) => {
    try {
      // console.log(tourGuideId);
      const response = await getCommentsForTourGuide(tourGuideId);
      setTourGuideComments(response.data.comments);
    } catch (error) {
      message.error("Failed to fetch tour guide comments");
    }
  };

  const averageRating = React.useMemo(() => {
    if (itinerary?.ratings.length === 0) return 0;
    return Number(
      (
        (itinerary?.ratings ?? []).reduce((acc, curr) => acc + curr.rating, 0) /
        (itinerary?.ratings?.length || 1)
      ).toFixed(1)
    );
  }, [itinerary?.ratings]);

  // Copy Link function
  const handleCopyLink = () => {
    const url = `${window.location.origin}/itinerary/iternaryDetails/${itineraryId}`;
    navigator.clipboard.writeText(url).then(
      () => message.success("Link copied to clipboard!"),
      () => message.error("Failed to copy link")
    );
  };

  // Share via Email function
  const handleShareEmail = () => {
    const subject = `Check out this itinerary: ${itinerary?.name}`;
    const body = `
    Itinerary Details:
    - Name: ${itinerary?.name}
    - Language: ${itinerary?.language}
    - Price: $${itinerary?.price}
    - Active: ${itinerary?.isActive ? "Yes" : "No"}
    - Pickup Location: ${itinerary?.pickupLocation || "N/A"}
    - Drop-off Location: ${itinerary?.dropOffLocation || "N/A"}
    - Available Dates: ${
      itinerary?.availableDates
        .map(
          (date) =>
            `${new Date(date.Date).toLocaleDateString()} at ${date.Times}`
        )
        .join(", ") || "No dates available"
    }
    - Accessibility: ${itinerary?.accessibility || "Not specified"}

    Activities:
    ${
      itinerary?.activities
        .map(
          (activity, index) =>
            `  ${index + 1}. ${activity.activity.name} - ${
              activity.duration
            } mins`
        )
        .join("\n") || "No activities listed"
    }

    Ratings: ${itinerary?.ratings?.length} ratings
    Average Rating: ${
      itinerary?.ratings?.length
        ? (
            itinerary.ratings?.reduce((sum, r) => sum + r.rating, 0) /
            itinerary.ratings?.length
          ).toFixed(1)
        : "No ratings yet"
    }

    Check out more details and book here: ${
      window.location.origin
    }/itinerary/iternaryDetails/${itineraryId}
  `;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleBookItinerary = (ItineraryId) => {
    window.location.href = `${window.location.origin}/itinerary/book/${ItineraryId}`;
  };

  return (
    <div className="items-center">
      <div className="min-h-screen p-8">
        
        <Space
          direction="vertical"
          size="large"
          className="relative w-full p-10"
        >
        

          {/* First Card for Itinerary Details */}
          <Row gutter={[16, 16]}>
  {/* First Column (Itinerary Details Card) */}
  <Col xs={150} sm={100} md={8} className="flex justify-center gap-4">
    <Card
      bordered={true} // Add border to the card
      className={`${cardStyle} ${gradientBg} w-1/3 border-third max-w-2xl mx-auto ml-0`}
      bodyStyle={{ height: "100%" }}
    >
      
      <div className="space-y-4">
        {/* Itinerary Name */}
        <Row justify="center" className="text-center mb-0 ">
          <Title
            level={2}
            className="font-extrabold text-first  mb-0"
            style={{ fontSize: "7rem", marginBottom: "0.15rem", color: "#1a2b49" }}
          >
            {itinerary?.name}
          </Title>
        </Row>

        {/* Description */}
        <Row justify="center" className="text-center">
          <p
            className="text-first text-lg font-medium mb-4"
            style={{ fontSize: "2rem" }}
          >
            {"Explore amazing travel experiences!"}
          </p>
        </Row>
        <Row
          justify="center"
          align="middle"
          className="text-center space-x-2"
        >
          {itinerary?.pickupLocation && (
            <Col>
              <Text className="text-first font-semibold text-2xl">
                {itinerary?.pickupLocation}
              </Text>
            </Col>
          )}

          {/* Arrow between the locations */}
          <Col className="flex items-center">
            <ArrowRightOutlined className="text-first text-1xl" />
          </Col>

          {itinerary?.dropOffLocation && (
            <Col>
              <Text className="text-first font-semibold text-2xl">
                {itinerary?.dropOffLocation}
              </Text>
            </Col>
          )}
        </Row>

        {/* Tags */}
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col>
            <Space size="small">
              <Tag
                icon={<GlobalOutlined />}
                color="magenta"
                className="text-white"
              >
                {itinerary?.language}
              </Tag>
              <Tag
                icon={<DollarOutlined />}
                color="green"
                className="text-white"
              >
                ${itinerary?.price}
              </Tag>
              {itinerary?.isActive && (
                <Tag
                  icon={<CheckCircleOutlined />}
                  color="success"
                  className="text-white"
                >
                  Active
                </Tag>
              )}
            </Space>
          </Col>

          {/* Rating and Actions */}
          <Col>
            <Space direction="vertical" align="center">
              <Rate disabled value={averageRating} allowHalf />
              <Text type="secondary" className="text-white">
                {itinerary?.ratings.length} ratings
              </Text>
              <Space>
                {/* Copy Link Button with Icon and Text on Hover */}
                <div className="flex items-center gap-4">
  {/* Copy Link Button */}
  <div className="relative group">
    {/* Invisible text, visible on hover */}
    <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-fourth text-first text-sm px-2 py-1 rounded shadow whitespace-nowrap">
      Copy Link
    </span>
    <Button
      icon={<CopyOutlined />}
      onClick={handleCopyLink}
      className="text-first bg-white hover:bg-gray-200"
    />
  </div>

  {/* Send Mail Button */}
  <div className="relative group">
    {/* Invisible text, visible on hover */}
    <span className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 bg-fourth text-first text-sm px-2 py-1 rounded shadow whitespace-nowrap">
      Send Mail
    </span>
    <Button
      icon={<MailOutlined />}
      onClick={handleShareEmail}
      className="text-first bg-white hover:bg-gray-200"
    />
  </div>
</div>

                
              </Space>
              
            </Space>
          </Col>
        </Row>
      </div>
      {user && user?.userRole === "Tourist" && (
  <Button
  onClick={() => handleBookItinerary(itinerary?._id)}
  className="w-full text-white text-4xl py-6 px-8 bg-first hover:bg-first transition-all duration-300 mt-4 border-2 border-[#496989] shadow-lg"
>
  Book
</Button>

)}

    </Card>
  </Col>

  {/* Second Column (Activities, Timeline, Available Dates Cards) */}
  <Col xs={24} sm={120} md={16} >
  <Row gutter={[16, 16]}>
  {/* Activities Card */}
  <Col xs={24} sm={12} md={8} className="flex justify-center gap-4">
    <Card
      className={`${cardStyle} ${gradientBg}  bg-third transform transition-all duration-300 ease-in-out`}
      bodyStyle={{ height: "220px", padding: "16px" }} // Same height and padding
    >
      <div className="flex items-center justify-center text-first mb-4">
        <TrophyOutlined size={20} className="mr-2 text-third text-bold text-2xl" />
        <span className="font-bold text-xl">Activities</span>
      </div>
      <List
        dataSource={itinerary?.activities}
        renderItem={(item) => (
          <List.Item
            className="cursor-pointer rounded-md px-2 py-1 mb-2 bg-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => navigate(`../activityDetails/${item.activity?._id}`)}
          >
            <Text className="text-first text-sm pl-3">
              {item.activity?.name}
            </Text>
            <Tag className="bg-second text-white border-none">
              {item.duration} min
            </Tag>
          </List.Item>
        )}
      />
    </Card>
  </Col>

  {/* Timeline Card */}
  <Col xs={24} sm={12} md={8} className="flex justify-center gap-4">
    <Card
      className={`${cardStyle} ${gradientBg} transform transition-all duration-300 ease-in-out`}
      bodyStyle={{ height: "220px", padding: "16px" }} // Same height and padding
    >
      <div className="flex items-center justify-center text-first mb-4">
        <Clock size={20} className="mr-2 text-third text-bold text-2xl" />
        <span className="font-bold text-xl">Timeline</span>
      </div>
      <Timeline
        items={itinerary?.timeline.map((item, index) => ({
          color: "#526D82",
          children: (
            <>
              <Text strong className="text-first">
                {item.activity?.name}
              </Text>
              {item.startTime && (
                <Text className="text-first/80 block">
                  Starts at {item.startTime}
                </Text>
              )}
              {item.duration && (
                <Tag className="bg-second text-white border-none mt-1">
                  {item.duration} min
                </Tag>
              )}
            </>
          ),
        }))}
      />
    </Card>
  </Col>

  {/* Available Dates Card */}
  <Col xs={24} sm={12} md={8} className="flex justify-center gap-4">
    <Card
      className={`${cardStyle} ${gradientBg} transform transition-all duration-300 ease-in-out `}
      bodyStyle={{ height: "220px", padding: "16px" }} // Same height and padding
    >
      <div className="flex items-center justify-center text-first mb-4">
        <Calendar size={20} className="mr-2 text-third text-bold text-2xl" />
        <span className="font-bold text-xl">Available Dates</span>
      </div>
      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={itinerary?.availableDates}
        renderItem={(date) => (
          <List.Item>
            <Card
              size="small"
              className="bg-white/10 shadow-sm rounded-lg mb-2 hover:bg-white/20 transition-all duration-300"
            >
              <Space className="justify-between w-full">
                <Text className="text-first">
                  {new Date(date.Date).toLocaleDateString()}
                </Text>
                <Tag className="bg-cyan-500 text-white border-none">
                  {date.Times}
                </Tag>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </Card>
  </Col>
</Row>

<Row xs={24} sm={12} md={8} className="flex justify-center gap-4">
  {/* Card for Comments */}
  <Card
    bordered={true}
    className={`${cardStyle} ${gradientBg} w-full border-third mt-4`}
    bodyStyle={{ padding: "8px 16px", height: "auto" }}
  >
    <div className={titleStyle}>
      <UserOutlined className="text-third" />
      <span className="text-first text-bold text-lg">Comments</span>
    </div>

    <div className="space-y-2">
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "8px",
          height: "80px",
        }}
      >
        {itinerary?.comments.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={itinerary.comments}
            renderItem={(comment) => (
              <List.Item
                className="transition-all duration-300 text-first rounded-xl"
                style={{
                  marginRight: "10px",
                  display: "inline-flex",
                  flexShrink: 0,
                  minWidth: "150px",
                }}
              >
                <List.Item.Meta
                  className="pl-3"
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <span className="text-third text-xs">
                      {comment?.createdBy?.username}
                    </span>
                  }
                  description={
                    <Space>
                      <Text className="text-first text-xs">
                        {comment?.comment}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
            style={{ padding: 0 }}
          />
        ) : (
          <div className="text-first text-xs pl-3">No comments yet</div>
        )}
      </div>
    </div>
  </Card>

  {/* Card for Tour Guide Reviews */}
  <Card
    bordered={true}
    className={`${cardStyle} ${gradientBg} w-full border-third mt-0`}
    bodyStyle={{ height: "100%", padding: 10 }}
  >
    <div className={titleStyle}>
      <UserOutlined className="text-third" />
      <span className="text-first">Tour Guide Reviews</span>
    </div>

    <div className="space-y-2">
      <div
        style={{
          display: "flex",
          flexWrap: "nowrap",
          overflowX: "auto",
          whiteSpace: "nowrap",
          paddingBottom: "8px",
          height: "80px",
        }}
      >
        {tourGuideComments?.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={tourGuideComments}
            renderItem={(comment) => (
              <List.Item
                className="transition-all duration-300 rounded-xl text-xs"
                style={{
                  marginRight: "0px",
                  display: "inline-flex",
                  flexShrink: 0,
                  minWidth: "150px",
                }}
              >
                <List.Item.Meta
                  className="pl-3"
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <span className="text-third text-xs">
                      {comment?.createdBy?.username}
                    </span>
                  }
                  description={
                    <Space>
                      <Text className="text-first text-xs">
                        {comment?.comment}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
            style={{ padding: 0 }}
          />
        ) : (
          <div className="text-first text-xs pl-3">No reviews yet</div>
        )}
      </div>
    </div>
  </Card>
</Row>

  </Col>
</Row>

          
<Card
  size="small"
  style={{
    borderColor: "black",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "15px",
    transition: "background-color 0.3s ease, box-shadow 0.3s ease",
    backgroundColor: "#94A3B8",
    height: "auto",
    maxHeight: "250px",
    width: "100%",  // Full width by default
    maxWidth: "800px", // Maximum width to prevent the card from becoming too wide
    margin: "0 auto",  // Centers the card
  }}
  onMouseEnter={() => setHoveredCard("footer")}
  onMouseLeave={() => setHoveredCard(null)}
  className="text-center"
>
  <Row xs={24} sm={12} md={8} className="flex justify-center gap-4">
    <Col span={24}>
      <div className="text-xl font-bold text-white mb-4">
        <EnvironmentOutlined size={20} className="text-fourth" />
        <span className="ml-2">Itinerary Information</span>
      </div>

      <Space
        direction="vertical"
        size="small"
        style={{ textAlign: "center" }}
        className="mt-6 flex justify-center sm:flex sm:flex-row sm:space-x-6 sm:text-left sm:items-center sm:space-y-0"
      >
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center"
        >
          <UserOutlined className="mr-2 text-fourth" />
          <strong>Created by: </strong> {tourGuide}
        </Text>
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center "
        >
          <CalendarOutlined className="mr-2 text-fourth" />
          <strong>Created on:</strong>{" "}
          {new Date(itinerary?.createdAt ?? "").toLocaleDateString()}
        </Text>
        <Text
          type="secondary"
          style={{ color: "black" }}
          className="flex items-center"
        >
          <ClockCircleOutlined className="mr-2 text-fourth" />
          <strong>Last Updated:</strong>{" "}
          {new Date(itinerary?.updatedAt ?? "").toLocaleDateString()}
        </Text>
      </Space>
    </Col>

    <Col span={24}>
      <div className="mt-2 flex justify-center space-x-6">
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-fourth hover:underline transition-all duration-300"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="text-white text-lg font-medium hover:text-fourth hover:underline transition-all duration-300"
        >
          Terms of Service
        </a>
      </div>
    </Col>

    <Col span={24}>
      <div className="mt-0 text-sm text-gray-400">
        <Text>© 2024 Teer Enta. All rights reserved.</Text>
      </div>
    </Col>
  </Row>
</Card>


        </Space>
      </div>
    </div>
  );
};
export default ItineraryDetails;
