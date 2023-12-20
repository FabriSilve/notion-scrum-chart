"use client";

import { BadgeDelta, Card, Flex, Metric, ProgressBar, Text } from "@tremor/react";

const KpiCard = ({
  label,
  value,
  avarage,
  increase,
}) => {
  return (
    <Card className="max-w-lg mx-auto">
      <Flex className="max-w-lg" justifyContent="between" alignItems="center">
        <Text>{label}</Text>
        <BadgeDelta deltaType={increase > 0 ? "moderateIncrease" : "moderateDecrease"} />
      </Flex>
      <Flex className="max-w-lg" justifyContent="between" alignItems="center">
        <Metric>{value}</Metric>
        <Text className="mr-4">avg. {avarage}</Text>
      </Flex>
      <ProgressBar value={value} className="mt-2" />
    </Card>
  );
}

export default KpiCard;
