import { Grid } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "../api";
import Room from "../components/Room";
import RoomSkeleton from "../components/RoomSkeleton";
import { IRoomList } from "../types";

export default function SubBoard() {
  const { isLoading, data } = useQuery<IRoomList[]>(["rooms"], getRooms);

  return (
    <Grid
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >
      {isLoading ? (
        <>
          <RoomSkeleton />
          {/* 여기에 추가적인 RoomSkeleton 컴포넌트 */}
        </>
      ) : null}
      {data?.map((room) => (
        <Room
          key={room.pk}
          pk={room.pk}
          isOwner={room.is_owner}
          imageUrl={room.photos[0].file}
          name={room.name}
          rating={room.rating}
          city={room.city}
          country={room.country}
          price={room.price}
        />
      ))}
    </Grid>
  );
}