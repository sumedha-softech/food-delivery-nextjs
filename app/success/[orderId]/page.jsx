import SuccessClient from '@/_components/success/success-client';

const SuccessPage = async ({ params }) => {
    const { orderId } = await params;

    return <SuccessClient orderId={orderId} />;
};

export default SuccessPage;
