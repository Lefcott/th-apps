import React, { useEffect } from "react";
import { Box, DialogContent, Typography, Divider } from "@material-ui/core";
import { get } from "lodash";
import { generateIdFn } from "@shared/utils";
import { useSearch, useFetchDesigns } from "@shared/hooks";
import { Search, CardList, EmptyResultText, Loader } from "@shared/components";
import { getOneSearchParam } from "@teamhub/api";
import DesignPlaceholder from "../../assets/DesignPlaceholder.svg";
import { useBottomScrollListener } from "react-bottom-scroll-listener";

export default function DesignSelection({
  onDesignSelect,
  selectedPages,
  documentId,
}) {
  const genId = generateIdFn("DesignSelection");
  const orientation = getOneSearchParam("orientation", undefined);
  const scrollRef = useBottomScrollListener(onScrollEnd);

  const [fetchDesigns, fetchNextPage, { data, loading }] = useFetchDesigns(
    orientation
  );
  const [search, setSearch, searchLoading] = useSearch(fetchDesigns);
  const designs = get(data, "community.contents", []).filter(
    (design) => design._id !== documentId
  );

  useEffect(() => {
    fetchDesigns(search);
  }, []);

  function onSearchChange(value) {
    setSearch(value);
  }

  function onScrollEnd() {
    fetchNextPage(search);
  }

  function getPageCounts() {
    return `${selectedPages.length} pages selected`;
  }

  function getPageState() {
    if (loading) {
      return <Loader label="loading-designs" />;
    }

    if (designs && !designs.length) {
      return (
        <EmptyResultText message={`No designs found named "${search}".`} />
      );
    }

    return (
      <CardList
        name="Designs"
        data={designs}
        onItemSelect={onDesignSelect}
        dataMapper={{
          id: "_id",
          image: "images[0]",
          imageDefault: () => DesignPlaceholder,
          title: "name",
        }}
      />
    );
  }

  return (
    <Box aria-label="design-selection">
      <DialogContent>
        <Box display="flex" mb={1}>
          <Box flex={1}>
            <Search
              genId={genId}
              loading={!loading && searchLoading}
              value={search}
              onChange={onSearchChange}
              placeholder="Search design by name"
            />
          </Box>

          <Box
            flex={1}
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Typography>{getPageCounts()}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <Divider />
      <DialogContent ref={scrollRef}>
        <Box height={425}>{getPageState()}</Box>
      </DialogContent>
    </Box>
  );
}
